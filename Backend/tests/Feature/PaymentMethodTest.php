<?php

namespace Tests\Feature;

use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentMethodTest extends TestCase
{
    use RefreshDatabase;

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_user_can_save_payment_method(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/payment-method', [
            'method'         => 'bank_transfer',
            'account_number' => '1234567890',
            'iban'           => 'EG0000123456',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Payment method saved successfully']);

        $this->assertDatabaseHas('payment_methods', [
            'user_id' => $user->id,
            'method'  => 'bank_transfer',
        ]);
    }

    public function test_payment_method_requires_method_field(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/payment-method', [
            'account_number' => '12345',
        ])->assertStatus(422);
    }

    public function test_payment_method_updates_instead_of_duplicating(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/payment-method', ['method' => 'cash']);
        $this->postJson('/api/payment-method', ['method' => 'bank_transfer']);

        $count = PaymentMethod::where('user_id', $user->id)->count();
        $this->assertEquals(1, $count);

        $this->assertDatabaseHas('payment_methods', [
            'user_id' => $user->id,
            'method'  => 'bank_transfer',
        ]);
    }

    public function test_payment_method_store_requires_authentication(): void
    {
        $this->postJson('/api/payment-method', ['method' => 'cash'])
             ->assertStatus(401);
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_user_can_get_their_payment_method(): void
    {
        $user = User::factory()->create();
        PaymentMethod::create([
            'user_id' => $user->id,
            'method'  => 'vodafone_cash',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/payment-method');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.method', 'vodafone_cash');
    }

    public function test_payment_method_show_returns_null_when_not_set(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/payment-method');

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'data' => null]);
    }

    public function test_user_only_sees_their_own_payment_method(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        PaymentMethod::create(['user_id' => $userB->id, 'method' => 'cash']);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/payment-method');

        $response->assertStatus(200)
                 ->assertJson(['data' => null]);
    }

    public function test_payment_method_show_requires_authentication(): void
    {
        $this->getJson('/api/payment-method')->assertStatus(401);
    }
}
