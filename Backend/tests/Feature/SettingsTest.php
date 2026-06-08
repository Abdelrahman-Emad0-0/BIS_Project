<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_user_can_view_settings(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.id', $user->id);
    }

    public function test_settings_does_not_expose_password(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $data = $this->getJson('/api/settings')->json('data');

        $this->assertArrayNotHasKey('password', $data);
    }

    public function test_settings_requires_authentication(): void
    {
        $this->getJson('/api/settings')->assertStatus(401);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_user_can_update_name_in_settings(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/settings', [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Settings updated successfully'])
                 ->assertJsonPath('data.name', 'Updated Name');

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function test_user_can_change_password_in_settings(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/settings', [
            'password'              => 'newpassword99',
            'password_confirmation' => 'newpassword99',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword99', $user->password));
    }

    public function test_password_update_requires_confirmation(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->putJson('/api/settings', [
            'password'              => 'newpassword99',
            'password_confirmation' => 'wrongconfirmation',
        ])->assertStatus(422);
    }

    public function test_settings_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->putJson('/api/settings', [
            'email' => 'existing@example.com',
        ])->assertStatus(422);
    }

    public function test_user_can_update_their_own_email(): void
    {
        $user = User::factory()->create(['email' => 'original@example.com']);
        Sanctum::actingAs($user);

        // Sending the same email should pass the unique check
        $response = $this->putJson('/api/settings', [
            'email' => 'original@example.com',
        ]);

        $response->assertStatus(200);
    }

    public function test_settings_rejects_invalid_gender(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->putJson('/api/settings', [
            'gender' => 'other',
        ])->assertStatus(422);
    }

    public function test_settings_update_requires_authentication(): void
    {
        $this->putJson('/api/settings', ['name' => 'Test'])->assertStatus(401);
    }
}
