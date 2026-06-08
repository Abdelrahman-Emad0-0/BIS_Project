<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ── Register ──────────────────────────────────────────────────────────────

    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Ahmed Ali',
            'email'                 => 'ahmed@example.com',
            'phone'                 => '01012345678',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'learner',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['success', 'token', 'user'])
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', ['email' => 'ahmed@example.com']);
    }

    public function test_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'dup@example.com']);

        $response = $this->postJson('/api/register', [
            'name'                  => 'Another User',
            'email'                 => 'dup@example.com',
            'phone'                 => '01099999999',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'female',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'learner',
        ]);

        $response->assertStatus(422);
    }

    public function test_registration_fails_with_password_mismatch(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'phone'                 => '01011111111',
            'password'              => 'password123',
            'password_confirmation' => 'wrong_password',
            'gender'                => 'male',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'learner',
        ]);

        $response->assertStatus(422);
    }

    public function test_registration_fails_with_missing_fields(): void
    {
        $response = $this->postJson('/api/register', [
            'email' => 'incomplete@example.com',
        ]);

        $response->assertStatus(422);
    }

    public function test_cannot_self_register_as_admin(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Fake Admin',
            'email'                 => 'fakeadmin@example.com',
            'phone'                 => '01055555555',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'admin',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('users', ['email' => 'fakeadmin@example.com', 'role' => 'admin']);
    }

    public function test_cannot_self_register_as_teacher_via_register_endpoint(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Fake Teacher',
            'email'                 => 'faketeacher@example.com',
            'phone'                 => '01044444444',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'teacher',
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('users', ['email' => 'faketeacher@example.com']);
    }

    public function test_exchange_user_can_register_with_both_role(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Exchange User',
            'email'                 => 'exchange@example.com',
            'phone'                 => '01033333333',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'female',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'both',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'exchange@example.com', 'role' => 'both']);
    }

    public function test_registration_fails_with_invalid_gender(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test',
            'email'                 => 'gendertest@example.com',
            'phone'                 => '01022222222',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'other',
            'date_of_birth'         => '1995-01-15',
            'role'                  => 'learner',
        ]);

        $response->assertStatus(422);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create([
            'email'    => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['success', 'token', 'user' => ['id', 'name', 'email', 'role']])
                 ->assertJson(['success' => true]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'wrong@example.com']);

        $response = $this->postJson('/api/login', [
            'email'    => 'wrong@example.com',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['success' => false]);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'nobody@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['success' => false]);
    }

    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422);
    }

    // ── Ping ──────────────────────────────────────────────────────────────────

    public function test_ping_returns_ok(): void
    {
        $this->getJson('/api/ping')
             ->assertStatus(200)
             ->assertJson(['ok' => true]);
    }
}
