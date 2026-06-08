<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(User $teacher): Course
    {
        return Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Reviewed Course',
            'description' => 'Desc',
            'price'       => 100,
            'category'    => 'Tech',
        ]);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_admin_can_list_all_reviews(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Review::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 4,
            'comment'   => 'Great!',
            'date'      => now(),
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/reviews');
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'reviews');
    }

    public function test_non_admin_cannot_list_reviews(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/reviews')->assertStatus(403);
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_admin_can_create_a_review(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/reviews', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 5,
            'comment'   => 'Excellent course!',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Review created successfully']);

        $this->assertDatabaseHas('reviews', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 5,
        ]);
    }

    /**
     * BUG: The review endpoint accepts user_id from the request body.
     * An admin can create a review pretending to be any user.
     * For user-facing reviews, user_id should come from auth()->id().
     */
    public function test_admin_can_create_review_as_any_user_authorization_bug(): void
    {
        $admin    = User::factory()->admin()->create();
        $victim   = User::factory()->create();
        $teacher  = User::factory()->teacher()->create();
        $course   = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/reviews', [
            'user_id'   => $victim->id,  // creating a review as the victim
            'course_id' => $course->id,
            'rating'    => 1,
            'comment'   => 'Fake bad review',
        ]);

        // Currently succeeds — the system allows a review on behalf of any user.
        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'user_id'   => $victim->id,
            'course_id' => $course->id,
        ]);
    }

    public function test_review_rating_must_be_between_1_and_5(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $this->postJson('/api/reviews', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 6,  // exceeds max
        ])->assertStatus(422);

        $this->postJson('/api/reviews', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 0,  // below min
        ])->assertStatus(422);
    }

    public function test_review_requires_user_and_course(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/reviews', [
            'rating' => 4,
        ])->assertStatus(422);
    }

    public function test_review_fails_with_invalid_course_id(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();

        Sanctum::actingAs($admin);

        $this->postJson('/api/reviews', [
            'user_id'   => $learner->id,
            'course_id' => 99999,
            'rating'    => 4,
        ])->assertStatus(422);
    }

    public function test_review_non_admin_cannot_create(): void
    {
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($learner);

        $this->postJson('/api/reviews', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'rating'    => 4,
        ])->assertStatus(403);
    }
}
