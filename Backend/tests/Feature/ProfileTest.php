<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exchange;
use App\Models\Review;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(User $teacher): Course
    {
        return Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Course',
            'description' => 'Desc',
            'price'       => 100,
            'category'    => 'Tech',
        ]);
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_authenticated_user_can_view_their_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.id', $user->id)
                 ->assertJsonPath('data.email', $user->email);
    }

    public function test_profile_does_not_expose_password(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile');
        $data = $response->json('data');

        $this->assertArrayNotHasKey('password', $data);
    }

    public function test_profile_requires_authentication(): void
    {
        $this->getJson('/api/profile')->assertStatus(401);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_user_can_update_their_profile(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Profile updated successfully'])
                 ->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'New Name']);
    }

    public function test_user_cannot_update_email_via_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'email' => 'hacked@example.com',
        ]);

        // Email is not in the validated fields — DB should not change
        $this->assertDatabaseMissing('users', ['email' => 'hacked@example.com']);
    }

    public function test_user_can_update_phone_if_unique(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/profile', [
            'phone' => '01099988877',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['id' => $user->id, 'phone' => '01099988877']);
    }

    public function test_update_profile_rejects_duplicate_phone(): void
    {
        $existingUser = User::factory()->create(['phone' => '01077777777']);
        $user         = User::factory()->create();

        Sanctum::actingAs($user);

        $this->putJson('/api/profile', [
            'phone' => '01077777777',
        ])->assertStatus(422);
    }

    public function test_profile_update_rejects_invalid_gender(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->putJson('/api/profile', [
            'gender' => 'alien',
        ])->assertStatus(422);
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    public function test_user_can_get_their_profile_stats(): void
    {
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 0,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->getJson('/api/profile/stats');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => [
                         'courses_enrolled',
                         'courses_teaching',
                         'skills_learned',
                         'sessions_completed',
                         'average_rating',
                         'exchanges_done',
                     ],
                 ])
                 ->assertJsonPath('data.courses_enrolled', 1);
    }

    public function test_profile_stats_counts_teaching_courses_correctly(): void
    {
        $teacher = User::factory()->teacher()->create();
        $this->makeCourse($teacher);
        $this->makeCourse($teacher);

        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/profile/stats');
        $response->assertStatus(200)
                 ->assertJsonPath('data.courses_teaching', 2);
    }

    // ── Achievements ──────────────────────────────────────────────────────────

    public function test_user_gets_consistent_learner_achievement_after_3_completions(): void
    {
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        for ($i = 0; $i < 3; $i++) {
            $course = $this->makeCourse($teacher);
            Enrollment::create([
                'user_id'   => $learner->id,
                'course_id' => $course->id,
                'status'    => 'completed',
                'progress'  => 100,
            ]);
        }

        Sanctum::actingAs($learner);

        $response = $this->getJson('/api/profile/achievements');
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $titles = array_column($response->json('data'), 'title');
        $this->assertContains('Consistent Learner', $titles);
    }

    public function test_user_gets_rising_star_after_first_completed_exchange(): void
    {
        $phpSkill = Skill::create(['name' => 'PHP']);
        $jsSkill  = Skill::create(['name' => 'JavaScript']);

        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Exchange::create([
            'requester_id'       => $userA->id,
            'partner_id'         => $userB->id,
            'requester_skill_id' => $phpSkill->id,
            'partner_skill_id'   => $jsSkill->id,
            'status'             => 'completed',
        ]);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/profile/achievements');
        $titles   = array_column($response->json('data'), 'title');

        $this->assertContains('Rising Star', $titles);
    }

    public function test_helpful_teacher_achievement_awarded_when_course_reviews_are_high(): void
    {
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        $reviewer = User::factory()->create();
        Review::create([
            'user_id'   => $reviewer->id,
            'course_id' => $course->id,
            'rating'    => 5,
            'date'      => now(),
        ]);

        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/profile/achievements');
        $titles   = array_column($response->json('data'), 'title');

        $this->assertContains('Helpful Teacher', $titles);
    }

    public function test_helpful_teacher_not_awarded_when_course_reviews_are_low(): void
    {
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        $reviewer = User::factory()->create();
        Review::create([
            'user_id'   => $reviewer->id,
            'course_id' => $course->id,
            'rating'    => 2,
            'date'      => now(),
        ]);

        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/profile/achievements');
        $titles   = array_column($response->json('data'), 'title');

        $this->assertNotContains('Helpful Teacher', $titles);
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    public function test_user_can_get_their_reviews(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Review::create([
            'user_id'   => $user->id,
            'course_id' => $course->id,
            'rating'    => 4,
            'date'      => now(),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/profile/reviews');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_user_reviews_only_shows_their_own_reviews(): void
    {
        $userA   = User::factory()->create();
        $userB   = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Review::create(['user_id' => $userA->id, 'course_id' => $course->id, 'rating' => 4, 'date' => now()]);
        Review::create(['user_id' => $userB->id, 'course_id' => $course->id, 'rating' => 3, 'date' => now()]);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/profile/reviews');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }
}
