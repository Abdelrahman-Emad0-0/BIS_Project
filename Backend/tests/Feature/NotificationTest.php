<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private function createNotification(User $user, bool $isRead = false): UserNotification
    {
        return UserNotification::create([
            'user_id' => $user->id,
            'title'   => 'Test Notification',
            'body'    => 'This is a test.',
            'is_read' => $isRead,
        ]);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_user_can_list_their_notifications(): void
    {
        $user = User::factory()->create();
        $this->createNotification($user);
        $this->createNotification($user);

        $otherUser = User::factory()->create();
        $this->createNotification($otherUser);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/notifications');
        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data');
    }

    public function test_notifications_index_requires_authentication(): void
    {
        $this->getJson('/api/notifications')->assertStatus(401);
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_authenticated_user_can_create_notification(): void
    {
        $sender   = User::factory()->create();
        $receiver = User::factory()->create();

        Sanctum::actingAs($sender);

        $response = $this->postJson('/api/notifications', [
            'user_id' => $receiver->id,
            'title'   => 'New Message',
            'body'    => 'You have a new message.',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user_notifications', [
            'user_id' => $receiver->id,
            'title'   => 'New Message',
        ]);
    }

    /**
     * BUG: Any authenticated user can create a notification for any other user.
     * The user_id should be restricted so only the system/admin can push notifications.
     */
    public function test_any_user_can_push_notification_to_another_user_authorization_bug(): void
    {
        $attacker = User::factory()->create();
        $victim   = User::factory()->create();

        Sanctum::actingAs($attacker);

        $response = $this->postJson('/api/notifications', [
            'user_id' => $victim->id,
            'title'   => 'Spam Notification',
            'body'    => 'Click here!',
        ]);

        // Should be restricted, but currently any user can push to any user — that is the bug.
        $response->assertStatus(201);
        $this->assertDatabaseHas('user_notifications', [
            'user_id' => $victim->id,
            'title'   => 'Spam Notification',
        ]);
    }

    public function test_notification_store_requires_user_id_and_title(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/notifications', [])->assertStatus(422);
    }

    // ── Mark As Read ──────────────────────────────────────────────────────────

    public function test_user_can_mark_notification_as_read(): void
    {
        $user         = User::factory()->create();
        $notification = $this->createNotification($user, false);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/notifications/{$notification->id}/read");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user_notifications', [
            'id'      => $notification->id,
            'is_read' => 1,
        ]);
    }

    public function test_user_cannot_mark_another_users_notification_as_read(): void
    {
        $owner    = User::factory()->create();
        $outsider = User::factory()->create();

        $notification = $this->createNotification($owner);

        Sanctum::actingAs($outsider);

        $this->putJson("/api/notifications/{$notification->id}/read")
             ->assertStatus(404);
    }

    // ── Mark All As Read ──────────────────────────────────────────────────────

    public function test_user_can_mark_all_notifications_as_read(): void
    {
        $user = User::factory()->create();
        $this->createNotification($user, false);
        $this->createNotification($user, false);
        $this->createNotification($user, false);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/notifications/read-all');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.updated_count', 3);

        $unreadCount = UserNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $this->assertEquals(0, $unreadCount);
    }

    public function test_mark_all_read_only_affects_authenticated_users_notifications(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $this->createNotification($userA, false);
        $this->createNotification($userB, false);

        Sanctum::actingAs($userA);

        $this->postJson('/api/notifications/read-all');

        // userB's notification should still be unread
        $this->assertDatabaseHas('user_notifications', [
            'user_id' => $userB->id,
            'is_read' => 0,
        ]);
    }

    public function test_mark_all_read_returns_zero_when_already_all_read(): void
    {
        $user = User::factory()->create();
        $this->createNotification($user, true);  // already read

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/notifications/read-all');

        $response->assertStatus(200)
                 ->assertJsonPath('data.updated_count', 0);
    }
}
