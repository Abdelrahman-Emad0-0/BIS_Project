<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VerificationTest extends TestCase
{
    use RefreshDatabase;

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_user_can_save_verification_data(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/verification', [
            'id_document'    => 'national_id_base64_string',
            'certificates'   => 'cert_base64_string',
            'payment_method' => 'bank_transfer',
            'iban'           => 'EG123456789',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Verification saved successfully']);

        $this->assertDatabaseHas('verifications', [
            'user_id'        => $user->id,
            'payment_method' => 'bank_transfer',
        ]);
    }

    public function test_verification_can_be_saved_with_all_nulls(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/verification', []);

        $response->assertStatus(201)
                 ->assertJson(['success' => true]);
    }

    public function test_verification_updates_instead_of_duplicating(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/verification', ['payment_method' => 'cash']);
        $this->postJson('/api/verification', ['payment_method' => 'bank_transfer']);

        $count = \App\Models\Verification::where('user_id', $user->id)->count();
        $this->assertEquals(1, $count);

        $this->assertDatabaseHas('verifications', [
            'user_id'        => $user->id,
            'payment_method' => 'bank_transfer',
        ]);
    }

    public function test_verification_store_requires_authentication(): void
    {
        $this->postJson('/api/verification', ['payment_method' => 'cash'])
             ->assertStatus(401);
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_user_can_get_their_verification(): void
    {
        $user = User::factory()->create();
        \App\Models\Verification::create([
            'user_id'        => $user->id,
            'payment_method' => 'bank',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/verification');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.user_id', $user->id);
    }

    public function test_verification_show_returns_null_when_not_submitted(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/verification');

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'data' => null]);
    }

    public function test_user_only_sees_their_own_verification(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        \App\Models\Verification::create([
            'user_id'        => $userB->id,
            'payment_method' => 'cash',
        ]);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/verification');

        // userA has no verification
        $response->assertStatus(200)
                 ->assertJson(['data' => null]);
    }

    public function test_verification_show_requires_authentication(): void
    {
        $this->getJson('/api/verification')->assertStatus(401);
    }
}
