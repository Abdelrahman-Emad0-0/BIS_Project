<?php

namespace Tests\Feature;

use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserSkillTest extends TestCase
{
    use RefreshDatabase;

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_user_can_save_teach_skills(): void
    {
        $user     = User::factory()->create();
        $skill1   = Skill::create(['name' => 'PHP']);
        $skill2   = Skill::create(['name' => 'Laravel']);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/my-skills', [
            'skill_ids' => [$skill1->id, $skill2->id],
            'type'      => 'teach',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Skills saved successfully']);

        $this->assertDatabaseHas('user_skills', [
            'user_id'  => $user->id,
            'skill_id' => $skill1->id,
            'type'     => 'teach',
        ]);
        $this->assertDatabaseHas('user_skills', [
            'user_id'  => $user->id,
            'skill_id' => $skill2->id,
            'type'     => 'teach',
        ]);
    }

    public function test_user_can_save_learn_skills(): void
    {
        $user  = User::factory()->create();
        $skill = Skill::create(['name' => 'Vue.js']);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/my-skills', [
            'skill_ids' => [$skill->id],
            'type'      => 'learn',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('user_skills', [
            'user_id'  => $user->id,
            'skill_id' => $skill->id,
            'type'     => 'learn',
        ]);
    }

    public function test_saving_same_skill_twice_does_not_duplicate(): void
    {
        $user  = User::factory()->create();
        $skill = Skill::create(['name' => 'Python']);

        Sanctum::actingAs($user);

        $this->postJson('/api/my-skills', ['skill_ids' => [$skill->id], 'type' => 'teach']);
        $this->postJson('/api/my-skills', ['skill_ids' => [$skill->id], 'type' => 'teach']);

        $count = UserSkill::where('user_id', $user->id)
            ->where('skill_id', $skill->id)
            ->where('type', 'teach')
            ->count();

        $this->assertEquals(1, $count);
    }

    public function test_skill_store_rejects_invalid_type(): void
    {
        $user  = User::factory()->create();
        $skill = Skill::create(['name' => 'Java']);

        Sanctum::actingAs($user);

        $this->postJson('/api/my-skills', [
            'skill_ids' => [$skill->id],
            'type'      => 'watch',  // invalid
        ])->assertStatus(422);
    }

    public function test_skill_store_rejects_nonexistent_skill_ids(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/my-skills', [
            'skill_ids' => [99999],
            'type'      => 'teach',
        ])->assertStatus(422);
    }

    public function test_skill_store_requires_authentication(): void
    {
        $skill = Skill::create(['name' => 'CSS']);

        $this->postJson('/api/my-skills', [
            'skill_ids' => [$skill->id],
            'type'      => 'teach',
        ])->assertStatus(401);
    }

    public function test_skill_store_requires_skill_ids_to_be_array(): void
    {
        $user  = User::factory()->create();
        $skill = Skill::create(['name' => 'React']);

        Sanctum::actingAs($user);

        $this->postJson('/api/my-skills', [
            'skill_ids' => $skill->id,  // not an array
            'type'      => 'teach',
        ])->assertStatus(422);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_user_can_list_their_skills(): void
    {
        $user   = User::factory()->create();
        $skill1 = Skill::create(['name' => 'Docker']);
        $skill2 = Skill::create(['name' => 'Kubernetes']);

        UserSkill::create(['user_id' => $user->id, 'skill_id' => $skill1->id, 'type' => 'teach']);
        UserSkill::create(['user_id' => $user->id, 'skill_id' => $skill2->id, 'type' => 'learn']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/my-skills');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'data');
    }

    public function test_user_only_sees_their_own_skills(): void
    {
        $userA  = User::factory()->create();
        $userB  = User::factory()->create();
        $skill  = Skill::create(['name' => 'AWS']);

        UserSkill::create(['user_id' => $userA->id, 'skill_id' => $skill->id, 'type' => 'teach']);
        UserSkill::create(['user_id' => $userB->id, 'skill_id' => $skill->id, 'type' => 'learn']);

        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/my-skills');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');  // only userA's skill
    }

    public function test_skill_index_requires_authentication(): void
    {
        $this->getJson('/api/my-skills')->assertStatus(401);
    }

    // ── Admin: Skill Creation ─────────────────────────────────────────────────

    public function test_admin_can_create_a_global_skill(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/skills', [
            'name' => 'GraphQL',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('skills', ['name' => 'GraphQL']);
    }

    public function test_non_admin_cannot_create_global_skill(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->postJson('/api/skills', ['name' => 'Redis'])
             ->assertStatus(403);
    }

    public function test_any_authenticated_user_can_list_skills(): void
    {
        $learner = User::factory()->create();
        Skill::create(['name' => 'TypeScript']);
        Skill::create(['name' => 'Rust']);

        Sanctum::actingAs($learner);

        $this->getJson('/api/skills')->assertStatus(200);
    }
}
