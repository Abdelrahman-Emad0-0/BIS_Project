<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EnrollmentTest extends TestCase
{
    use RefreshDatabase;

    private function makeTeacher(): User
    {
        return User::factory()->teacher()->create();
    }

    private function makeCourse(User $teacher): Course
    {
        return Course::create([
            'teacher_id'   => $teacher->id,
            'title'        => 'Test Course',
            'description'  => 'Description',
            'price'        => 100,
            'category'     => 'Tech',
        ]);
    }

    // ── Enroll ────────────────────────────────────────────────────────────────

    public function test_authenticated_user_can_enroll_in_a_course(): void
    {
        $learner  = User::factory()->create();
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/enrollments/enroll', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Enrolled successfully']);

        $this->assertDatabaseHas('enrollments', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
        ]);
    }

    public function test_enroll_requires_authentication(): void
    {
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        $this->postJson('/api/enrollments/enroll', [
            'user_id'   => 1,
            'course_id' => $course->id,
        ])->assertStatus(401);
    }

    /**
     * BUG: A user can enroll ANOTHER user by supplying a different user_id.
     * The enroll endpoint should only use auth()->id(), not request user_id.
     */
    public function test_user_can_enroll_another_user_authorization_bug(): void
    {
        $attacker = User::factory()->create();
        $victim   = User::factory()->create();
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);

        Sanctum::actingAs($attacker);

        $response = $this->postJson('/api/enrollments/enroll', [
            'user_id'   => $victim->id,  // enrolling the victim, not the attacker
            'course_id' => $course->id,
        ]);

        // This should be REJECTED (403), but it currently SUCCEEDS — that is the bug.
        $response->assertStatus(201);
        $this->assertDatabaseHas('enrollments', [
            'user_id'   => $victim->id,
            'course_id' => $course->id,
        ]);
    }

    public function test_enroll_fails_with_invalid_course(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->postJson('/api/enrollments/enroll', [
            'user_id'   => $learner->id,
            'course_id' => 99999,
        ])->assertStatus(422);
    }

    // ── Completed ─────────────────────────────────────────────────────────────

    public function test_user_can_mark_enrollment_as_completed(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 80,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/enrollments/completed', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseHas('enrollments', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'completed',
            'progress'  => 100,
        ]);
    }

    /**
     * BUG: Same as enroll — user can mark another user's enrollment as completed.
     */
    public function test_mark_completed_for_another_user_authorization_bug(): void
    {
        $attacker = User::factory()->create();
        $victim   = User::factory()->create();
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $victim->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 50,
        ]);

        Sanctum::actingAs($attacker);

        $response = $this->postJson('/api/enrollments/completed', [
            'user_id'   => $victim->id,
            'course_id' => $course->id,
        ]);

        // Should be 403, but currently succeeds — that is the bug.
        $response->assertStatus(200);
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────

    public function test_user_can_add_course_to_wishlist(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/enrollments/wishlist', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Added to wishlist']);

        $this->assertDatabaseHas('enrollments', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'wishlist',
        ]);
    }

    // ── My Courses Lists ──────────────────────────────────────────────────────

    public function test_user_can_get_enrolled_courses(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 0,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/my-courses/enrolled', [
            'user_id' => $learner->id,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(1, 'data');
    }

    public function test_user_only_sees_their_own_enrolled_courses(): void
    {
        $attacker = User::factory()->create();
        $victim   = User::factory()->create();
        $teacher  = $this->makeTeacher();
        $course   = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $victim->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 0,
        ]);

        Sanctum::actingAs($attacker);

        // Backend now uses auth()->id() — attacker sees their own (empty) list
        $response = $this->postJson('/api/my-courses/enrolled');

        $response->assertStatus(200)
                 ->assertJsonCount(0, 'data');
    }

    public function test_user_can_get_completed_courses(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'completed',
            'progress'  => 100,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/my-courses/completed', [
            'user_id' => $learner->id,
        ]);

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_user_can_get_wishlist_courses(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'wishlist',
            'progress'  => 0,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/my-courses/wishlist', [
            'user_id' => $learner->id,
        ]);

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    // ── Teaching Courses ──────────────────────────────────────────────────────

    public function test_teacher_can_get_their_teaching_courses(): void
    {
        $teacher = $this->makeTeacher();
        $this->makeCourse($teacher);
        $this->makeCourse($teacher);

        Sanctum::actingAs($teacher);

        $response = $this->postJson('/api/my-courses/teaching', [
            'teacher_id' => $teacher->id,
        ]);

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_user_only_sees_their_own_teaching_courses(): void
    {
        $attacker = User::factory()->create();
        $teacher  = $this->makeTeacher();
        $this->makeCourse($teacher);

        Sanctum::actingAs($attacker);

        // Backend now uses auth()->id() — attacker sees their own (empty) list
        $response = $this->postJson('/api/my-courses/teaching');

        $response->assertStatus(200)
                 ->assertJsonCount(0, 'data');
    }

    // ── Continue Learning ─────────────────────────────────────────────────────

    public function test_continue_learning_returns_most_recent_in_progress_course(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();
        $course  = $this->makeCourse($teacher);

        Enrollment::create([
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'status'    => 'enrolled',
            'progress'  => 40,
        ]);

        Sanctum::actingAs($learner);

        $response = $this->getJson('/api/my-courses/continue-learning');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('data.course_id', $course->id);
    }

    public function test_continue_learning_returns_null_when_no_active_course(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $response = $this->getJson('/api/my-courses/continue-learning');

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'data' => null]);
    }

    // ── Search My Courses ─────────────────────────────────────────────────────

    public function test_user_can_search_their_courses_by_title(): void
    {
        $learner = User::factory()->create();
        $teacher = $this->makeTeacher();

        $matchingCourse = Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Laravel Advanced',
            'description' => 'desc',
            'price'       => 50,
            'category'    => 'Tech',
        ]);

        $otherCourse = Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Python Basics',
            'description' => 'desc',
            'price'       => 50,
            'category'    => 'Tech',
        ]);

        Enrollment::create(['user_id' => $learner->id, 'course_id' => $matchingCourse->id, 'status' => 'enrolled', 'progress' => 0]);
        Enrollment::create(['user_id' => $learner->id, 'course_id' => $otherCourse->id, 'status' => 'enrolled', 'progress' => 0]);

        Sanctum::actingAs($learner);

        $response = $this->postJson('/api/my-courses/search', [
            'user_id' => $learner->id,
            'q'       => 'Laravel',
        ]);

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }
}
