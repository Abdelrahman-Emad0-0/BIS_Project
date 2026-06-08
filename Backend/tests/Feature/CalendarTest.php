<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CalendarTest extends TestCase
{
    use RefreshDatabase;

    private function createEvent(User $user, array $overrides = []): int
    {
        return DB::table('calendar_events')->insertGetId(array_merge([
            'user_id'    => $user->id,
            'title'      => 'My Event',
            'type'       => 'meeting',
            'starts_at'  => now()->toDateTimeString(),
            'created_at' => now(),
            'updated_at' => now(),
        ], $overrides));
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_user_can_view_calendar(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/calendar');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => [
                         'current_month',
                         'view',
                         'range',
                         'events',
                         'sessions',
                         'upcoming_sessions',
                         'mini_calendar',
                         'filters',
                     ],
                 ]);
    }

    public function test_calendar_supports_week_view(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/calendar?view=week');

        $response->assertStatus(200)
                 ->assertJsonPath('data.view', 'week');
    }

    public function test_calendar_supports_day_view(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/calendar?view=day');

        $response->assertStatus(200)
                 ->assertJsonPath('data.view', 'day');
    }

    public function test_calendar_requires_authentication(): void
    {
        $this->getJson('/api/calendar')->assertStatus(401);
    }

    // ── Store Event ───────────────────────────────────────────────────────────

    public function test_user_can_create_calendar_event(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/calendar/events', [
            'title'     => 'Team Meeting',
            'type'      => 'meeting',
            'starts_at' => now()->addDay()->toDateTimeString(),
            'ends_at'   => now()->addDay()->addHour()->toDateTimeString(),
            'color'     => 'blue',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Event created successfully.'])
                 ->assertJsonStructure(['data' => ['id']]);

        $this->assertDatabaseHas('calendar_events', [
            'user_id' => $user->id,
            'title'   => 'Team Meeting',
        ]);
    }

    public function test_event_creation_requires_title_type_and_starts_at(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/calendar/events', [])->assertStatus(422);
    }

    public function test_event_type_must_be_valid(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/calendar/events', [
            'title'     => 'Bad type',
            'type'      => 'birthday', // not in enum
            'starts_at' => now()->toDateTimeString(),
        ])->assertStatus(422);
    }

    public function test_ends_at_must_be_after_starts_at(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/calendar/events', [
            'title'     => 'Event',
            'type'      => 'meeting',
            'starts_at' => now()->addHour()->toDateTimeString(),
            'ends_at'   => now()->toDateTimeString(), // before starts_at
        ])->assertStatus(422);
    }

    public function test_event_creation_requires_authentication(): void
    {
        $this->postJson('/api/calendar/events', [
            'title'     => 'Event',
            'type'      => 'meeting',
            'starts_at' => now()->toDateTimeString(),
        ])->assertStatus(401);
    }

    // ── Update Event ──────────────────────────────────────────────────────────

    public function test_user_can_update_their_event(): void
    {
        $user    = User::factory()->create();
        $eventId = $this->createEvent($user, ['title' => 'Old Title']);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/calendar/events/{$eventId}", [
            'title' => 'New Title',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Event updated successfully.']);

        $this->assertDatabaseHas('calendar_events', ['id' => $eventId, 'title' => 'New Title']);
    }

    public function test_user_cannot_update_another_users_event(): void
    {
        $owner    = User::factory()->create();
        $attacker = User::factory()->create();
        $eventId  = $this->createEvent($owner);

        Sanctum::actingAs($attacker);

        $response = $this->putJson("/api/calendar/events/{$eventId}", [
            'title' => 'Hacked',
        ]);

        $response->assertStatus(404);
    }

    // ── Destroy Event ─────────────────────────────────────────────────────────

    public function test_user_can_delete_their_event(): void
    {
        $user    = User::factory()->create();
        $eventId = $this->createEvent($user);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/calendar/events/{$eventId}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Event deleted successfully.']);

        $this->assertDatabaseMissing('calendar_events', ['id' => $eventId]);
    }

    public function test_deleting_nonexistent_event_still_returns_200(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // destroy uses DELETE without firstOrFail — silently succeeds
        $this->deleteJson('/api/calendar/events/99999')
             ->assertStatus(200);
    }

    // ── Store Session ─────────────────────────────────────────────────────────

    public function test_user_can_create_a_calendar_session(): void
    {
        $instructor = User::factory()->create();
        $student    = User::factory()->create();

        Sanctum::actingAs($instructor);

        $response = $this->postJson('/api/calendar/sessions', [
            'instructor_id' => $instructor->id,
            'student_id'    => $student->id,
            'starts_at'     => now()->addDay()->toDateTimeString(),
            'ends_at'       => now()->addDay()->addHour()->toDateTimeString(),
            'title'         => 'PHP Tutoring',
            'type'          => 'session',
            'status'        => 'scheduled',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Session created successfully.']);

        $this->assertDatabaseHas('calendar_sessions', [
            'instructor_id' => $instructor->id,
            'student_id'    => $student->id,
        ]);
    }

    public function test_session_requires_instructor_student_and_starts_at(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/calendar/sessions', [])->assertStatus(422);
    }

    public function test_session_status_must_be_valid(): void
    {
        $instructor = User::factory()->create();
        $student    = User::factory()->create();

        Sanctum::actingAs($instructor);

        $this->postJson('/api/calendar/sessions', [
            'instructor_id' => $instructor->id,
            'student_id'    => $student->id,
            'starts_at'     => now()->addDay()->toDateTimeString(),
            'status'        => 'unknown_status',
        ])->assertStatus(422);
    }
}
