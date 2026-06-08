<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    // ── Dashboard ─────────────────────────────────────────────────────────────

    public function test_admin_can_access_dashboard(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'total_students',
                     'total_teachers',
                     'total_courses',
                     'total_revenue',
                     'latest_users',
                     'recent_reports',
                     'recent_activities',
                 ]);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/dashboard')->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $this->getJson('/api/dashboard')->assertStatus(401);
    }

    public function test_dashboard_counts_reflect_actual_data(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create(['role' => 'learner']);
        $teacher = User::factory()->teacher()->create();

        Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Test',
            'description' => 'Desc',
            'price'       => 50,
            'category'    => 'Tech',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/dashboard');

        $response->assertStatus(200)
                 ->assertJsonPath('total_students', 1)
                 ->assertJsonPath('total_teachers', 1)
                 ->assertJsonPath('total_courses', 1);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    public function test_admin_can_access_analytics(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/analytics');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'analytics' => [
                         'users'       => ['total', 'students', 'teachers', 'admins'],
                         'courses'     => ['total'],
                         'enrollments' => ['total'],
                         'payments'    => ['total_transactions', 'total_revenue'],
                         'reviews'     => ['total_reviews', 'average_rating'],
                         'exchanges'   => ['total_matches'],
                         'sessions'    => ['total_sessions'],
                     ],
                 ]);
    }

    public function test_non_admin_cannot_access_analytics(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/analytics')->assertStatus(403);
    }

    // ── User Management ───────────────────────────────────────────────────────

    public function test_admin_can_list_all_users(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'users']);

        $this->assertCount(4, $response->json('users')); // 3 + admin
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/users')->assertStatus(403);
    }

    public function test_admin_can_view_a_single_user(): void
    {
        $admin  = User::factory()->admin()->create();
        $target = User::factory()->create();

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/users/{$target->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('user.id', $target->id);
    }

    public function test_viewing_nonexistent_user_returns_404(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/users/99999')->assertStatus(404);
    }

    public function test_admin_can_update_a_user(): void
    {
        $admin  = User::factory()->admin()->create();
        $target = User::factory()->create(['name' => 'Old Name']);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/users/{$target->id}", [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'User updated successfully']);

        $this->assertDatabaseHas('users', ['id' => $target->id, 'name' => 'New Name']);
    }

    public function test_admin_can_delete_a_user(): void
    {
        $admin  = User::factory()->admin()->create();
        $target = User::factory()->create();

        Sanctum::actingAs($admin);

        $this->deleteJson("/api/users/{$target->id}")
             ->assertStatus(200)
             ->assertJson(['message' => 'User deleted successfully']);

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_non_admin_cannot_delete_a_user(): void
    {
        $learner = User::factory()->create();
        $target  = User::factory()->create();

        Sanctum::actingAs($learner);

        $this->deleteJson("/api/users/{$target->id}")->assertStatus(403);
    }

    public function test_updating_user_email_must_be_unique(): void
    {
        $admin   = User::factory()->admin()->create();
        $userA   = User::factory()->create(['email' => 'taken@example.com']);
        $userB   = User::factory()->create();

        Sanctum::actingAs($admin);

        $this->putJson("/api/users/{$userB->id}", [
            'email' => 'taken@example.com',
        ])->assertStatus(422);
    }
}
