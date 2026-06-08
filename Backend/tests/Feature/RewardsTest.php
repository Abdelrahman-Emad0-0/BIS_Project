<?php

namespace Tests\Feature;

use App\Models\PointLedger;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RewardsTest extends TestCase
{
    use RefreshDatabase;

    private function givePoints(User $user, int $points): void
    {
        PointLedger::create([
            'user_id'     => $user->id,
            'source_type' => 'test',
            'source_id'   => null,
            'points'      => $points,
            'description' => 'Test points',
        ]);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_user_can_view_rewards(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/rewards');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => [
                         'total_points',
                         'weekly_points',
                         'current_level',
                         'points_to_next_reward',
                         'next_reward',
                         'how_you_earn',
                         'student_rewards',
                         'instructor_rewards',
                         'redemptions',
                     ],
                 ]);
    }

    public function test_rewards_returns_correct_total_points(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 200);
        $this->givePoints($user, 150);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/rewards');
        $response->assertStatus(200)
                 ->assertJsonPath('data.total_points', 350);
    }

    public function test_rewards_level_starts_as_beginner(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/rewards');
        $response->assertStatus(200)
                 ->assertJsonPath('data.current_level.name', 'Beginner');
    }

    public function test_rewards_level_advances_with_enough_points(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 600); // above 500 threshold = Learner

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/rewards');
        $response->assertStatus(200)
                 ->assertJsonPath('data.current_level.name', 'Learner');
    }

    public function test_rewards_how_you_earn_comes_from_config(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/rewards');
        $response->assertStatus(200);

        $this->assertNotNull($response->json('data.how_you_earn'));
        $this->assertIsArray($response->json('data.how_you_earn'));
    }

    public function test_rewards_requires_authentication(): void
    {
        $this->getJson('/api/rewards')->assertStatus(401);
    }

    // ── Redeem ────────────────────────────────────────────────────────────────

    public function test_user_can_redeem_a_reward_with_enough_points(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 500);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/rewards/redeem', [
            'reward_code' => 'STUDENT_DISCOUNT_10',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Reward redeemed successfully.']);

        $this->assertDatabaseHas('reward_redemptions', [
            'user_id'     => $user->id,
            'reward_code' => 'STUDENT_DISCOUNT_10',
        ]);

        // Points should be deducted
        $totalPoints = DB::table('points_ledger')
            ->where('user_id', $user->id)
            ->sum('points');

        $this->assertEquals(200, $totalPoints); // 500 - 300 = 200
    }

    public function test_user_cannot_redeem_with_insufficient_points(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 100); // needs 300 for STUDENT_DISCOUNT_10

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/rewards/redeem', [
            'reward_code' => 'STUDENT_DISCOUNT_10',
        ]);

        $response->assertStatus(422);

        $this->assertDatabaseMissing('reward_redemptions', ['user_id' => $user->id]);
    }

    public function test_redeem_fails_with_invalid_reward_code(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 1000);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/rewards/redeem', [
            'reward_code' => 'NONEXISTENT_CODE',
        ]);

        $response->assertStatus(422);
    }

    public function test_redeem_requires_reward_code(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/rewards/redeem', [])->assertStatus(422);
    }

    public function test_redeem_deducts_points_from_ledger(): void
    {
        $user = User::factory()->create();
        $this->givePoints($user, 1000);

        Sanctum::actingAs($user);

        $this->postJson('/api/rewards/redeem', ['reward_code' => 'STUDENT_DISCOUNT_25']); // costs 750

        $total = DB::table('points_ledger')->where('user_id', $user->id)->sum('points');
        $this->assertEquals(250, $total); // 1000 - 750
    }

    public function test_redeem_requires_authentication(): void
    {
        $this->postJson('/api/rewards/redeem', ['reward_code' => 'STUDENT_DISCOUNT_10'])
             ->assertStatus(401);
    }
}
