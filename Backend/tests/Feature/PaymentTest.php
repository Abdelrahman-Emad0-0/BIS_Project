<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentTest extends TestCase
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

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_admin_can_create_a_payment(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/payments', [
            'user_id'        => $learner->id,
            'amount'         => 150.00,
            'payment_method' => 'credit_card',
            'service_type'   => 'course',
            'service_id'     => $course->id,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Payment completed successfully']);

        $this->assertDatabaseHas('payments', [
            'user_id'  => $learner->id,
            'amount'   => 150.00,
            'currency' => 'EGP',
            'status'   => 'completed',
        ]);
    }

    /**
     * BUG: The admin payment endpoint accepts user_id from the request body.
     * A regular user could (if they hit the admin endpoint) create a payment on behalf of any user.
     * However, since this is admin-only, the bigger issue is that admins
     * can silently assign a payment to anyone — no ownership check on service_id.
     */
    public function test_payment_hardcodes_currency_to_egp(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/payments', [
            'user_id'        => $learner->id,
            'amount'         => 50,
            'payment_method' => 'cash',
            'service_type'   => 'course',
            'service_id'     => $course->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', ['currency' => 'EGP', 'status' => 'completed']);
    }

    public function test_non_admin_cannot_create_payment(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->postJson('/api/payments', [
            'user_id'        => $learner->id,
            'amount'         => 100,
            'payment_method' => 'cash',
            'service_type'   => 'course',
            'service_id'     => 1,
        ])->assertStatus(403);
    }

    public function test_payment_store_requires_all_fields(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/payments', [
            'amount' => 100,
        ])->assertStatus(422);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_admin_can_list_all_payments(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();

        Payment::create([
            'user_id'        => $learner->id,
            'amount'         => 100,
            'payment_method' => 'cash',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => 1,
            'date'           => now(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/payments');
        $response->assertStatus(200);

        $this->assertCount(1, $response->json());
    }

    public function test_non_admin_cannot_list_payments(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/payments')->assertStatus(403);
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_admin_can_view_a_single_payment(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();

        $payment = Payment::create([
            'user_id'        => $learner->id,
            'amount'         => 200,
            'payment_method' => 'bank',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => 1,
            'date'           => now(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/payments/{$payment->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('id', $payment->id);
    }

    public function test_payment_show_returns_404_for_nonexistent_id(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/payments/99999')->assertStatus(404);
    }

    // ── Update & Delete (BUG: routes exist, methods do not) ───────────────────

    public function test_admin_can_update_a_payment(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();

        $payment = Payment::create([
            'user_id'        => $learner->id,
            'amount'         => 100,
            'payment_method' => 'cash',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => 1,
            'date'           => now(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/payments/{$payment->id}", [
            'amount' => 200,
            'status' => 'refunded',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('payments', [
            'id'     => $payment->id,
            'amount' => 200,
            'status' => 'refunded',
        ]);
    }

    public function test_admin_can_delete_a_payment(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();

        $payment = Payment::create([
            'user_id'        => $learner->id,
            'amount'         => 100,
            'payment_method' => 'cash',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => 1,
            'date'           => now(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/payments/{$payment->id}");

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('payments', ['id' => $payment->id]);
    }
}
