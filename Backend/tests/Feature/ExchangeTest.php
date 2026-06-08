<?php

namespace Tests\Feature;

use App\Models\Exchange;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExchangeTest extends TestCase
{
    use RefreshDatabase;

    private function createSkill(string $name = 'PHP'): Skill
    {
        return Skill::create(['name' => $name]);
    }

    private function assignSkill(User $user, Skill $skill, string $type): void
    {
        UserSkill::create([
            'user_id'  => $user->id,
            'skill_id' => $skill->id,
            'type'     => $type,
        ]);
    }

    private function makeExchange(User $requester, User $partner, Skill $rSkill, Skill $pSkill, string $status = 'pending'): Exchange
    {
        return Exchange::create([
            'requester_id'      => $requester->id,
            'partner_id'        => $partner->id,
            'requester_skill_id' => $rSkill->id,
            'partner_skill_id'  => $pSkill->id,
            'status'            => $status,
        ]);
    }

    // ── Matches ───────────────────────────────────────────────────────────────

    public function test_user_can_find_skill_exchange_matches(): void
    {
        $phpSkill  = $this->createSkill('PHP');
        $cssSkill  = $this->createSkill('CSS');

        $userA = User::factory()->create();
        $userB = User::factory()->create();

        // A teaches PHP, wants to learn CSS
        $this->assignSkill($userA, $phpSkill, 'teach');
        $this->assignSkill($userA, $cssSkill, 'learn');

        // B teaches CSS, wants to learn PHP — perfect match
        $this->assignSkill($userB, $cssSkill, 'teach');
        $this->assignSkill($userB, $phpSkill, 'learn');

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/exchange/matches');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($userB->id, $data[0]['user']['id']);
    }

    public function test_matches_excludes_self(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $user = User::factory()->create();
        $this->assignSkill($user, $phpSkill, 'teach');
        $this->assignSkill($user, $jsSkill, 'learn');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/exchange/matches');
        $response->assertStatus(200);

        $data = $response->json('data');
        foreach ($data as $match) {
            $this->assertNotEquals($user->id, $match['user']['id']);
        }
    }

    public function test_matches_returns_empty_when_no_skills(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/exchange/matches');
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_user_can_list_their_exchanges(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $this->assignSkill($userA, $phpSkill, 'teach');
        $this->assignSkill($userB, $jsSkill, 'teach');

        $this->makeExchange($userA, $userB, $phpSkill, $jsSkill);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/exchange');
        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_exchange_index_requires_authentication(): void
    {
        $this->getJson('/api/exchange')->assertStatus(401);
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_user_can_create_exchange_request(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $this->assignSkill($requester, $phpSkill, 'teach');
        $this->assignSkill($partner, $jsSkill, 'teach');

        Sanctum::actingAs($requester);

        $response = $this->postJson('/api/exchange', [
            'partner_id'         => $partner->id,
            'requester_skill_id' => $phpSkill->id,
            'partner_skill_id'   => $jsSkill->id,
            'message'            => 'Let us swap skills!',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Exchange request sent successfully']);

        $this->assertDatabaseHas('exchanges', [
            'requester_id' => $requester->id,
            'partner_id'   => $partner->id,
            'status'       => 'pending',
        ]);
    }

    public function test_user_cannot_exchange_with_themselves(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $user = User::factory()->create();
        $this->assignSkill($user, $phpSkill, 'teach');
        $this->assignSkill($user, $jsSkill, 'teach');

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/exchange', [
            'partner_id'         => $user->id,
            'requester_skill_id' => $phpSkill->id,
            'partner_skill_id'   => $jsSkill->id,
        ]);

        $response->assertStatus(422)
                 ->assertJson(['success' => false, 'message' => 'You cannot exchange with yourself.']);
    }

    public function test_user_cannot_offer_skill_they_do_not_teach(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        // Requester has PHP as 'learn', NOT 'teach'
        $this->assignSkill($requester, $phpSkill, 'learn');
        $this->assignSkill($partner, $jsSkill, 'teach');

        Sanctum::actingAs($requester);

        $response = $this->postJson('/api/exchange', [
            'partner_id'         => $partner->id,
            'requester_skill_id' => $phpSkill->id,
            'partner_skill_id'   => $jsSkill->id,
        ]);

        $response->assertStatus(422)
                 ->assertJson(['success' => false, 'message' => 'You do not own the skill you want to offer.']);
    }

    public function test_exchange_fails_if_partner_does_not_teach_requested_skill(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $this->assignSkill($requester, $phpSkill, 'teach');
        // Partner has jsSkill as 'learn', NOT 'teach'
        $this->assignSkill($partner, $jsSkill, 'learn');

        Sanctum::actingAs($requester);

        $response = $this->postJson('/api/exchange', [
            'partner_id'         => $partner->id,
            'requester_skill_id' => $phpSkill->id,
            'partner_skill_id'   => $jsSkill->id,
        ]);

        $response->assertStatus(422)
                 ->assertJson(['success' => false, 'message' => 'The partner does not teach the requested skill.']);
    }

    // ── Update Status ─────────────────────────────────────────────────────────

    public function test_partner_can_accept_exchange_request(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($partner);

        $response = $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'accepted',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('exchanges', ['id' => $exchange->id, 'status' => 'accepted']);
    }

    public function test_partner_can_reject_exchange_request(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($partner);

        $response = $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'rejected',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('exchanges', ['id' => $exchange->id, 'status' => 'rejected']);
    }

    public function test_requester_cannot_accept_their_own_request(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($requester);

        $response = $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'accepted',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exchanges', ['id' => $exchange->id, 'status' => 'pending']);
    }

    public function test_requester_cannot_reject_their_own_request(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($requester);

        $response = $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'rejected',
        ]);

        $response->assertStatus(403);
    }

    public function test_either_party_can_mark_exchange_as_completed(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill, 'accepted');

        Sanctum::actingAs($requester);

        $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'completed',
        ])->assertStatus(200);
    }

    public function test_unrelated_user_cannot_update_exchange_status(): void
    {
        $phpSkill  = $this->createSkill('PHP');
        $jsSkill   = $this->createSkill('JavaScript');

        $requester  = User::factory()->create();
        $partner    = User::factory()->create();
        $outsider   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($outsider);

        $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'accepted',
        ])->assertStatus(404);
    }

    public function test_status_update_rejects_invalid_status_values(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $requester = User::factory()->create();
        $partner   = User::factory()->create();

        $exchange = $this->makeExchange($requester, $partner, $phpSkill, $jsSkill);

        Sanctum::actingAs($partner);

        $this->putJson("/api/exchange/{$exchange->id}/status", [
            'status' => 'cancelled',  // not in enum
        ])->assertStatus(422);
    }

    // ── Overview ──────────────────────────────────────────────────────────────

    public function test_user_can_get_exchange_overview(): void
    {
        $phpSkill = $this->createSkill('PHP');
        $jsSkill  = $this->createSkill('JavaScript');

        $user    = User::factory()->create();
        $partner = User::factory()->create();

        $this->assignSkill($user, $phpSkill, 'teach');
        $this->assignSkill($user, $jsSkill, 'learn');

        $this->makeExchange($user, $partner, $phpSkill, $jsSkill, 'accepted');
        $this->makeExchange($partner, $user, $jsSkill, $phpSkill, 'pending');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/exchange/overview');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => ['total_matches', 'pending_requests', 'skills_can_teach', 'skills_want_to_learn'],
                 ]);
    }
}
