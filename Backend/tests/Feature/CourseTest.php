<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(User $teacher, array $overrides = []): Course
    {
        return Course::create(array_merge([
            'teacher_id'  => $teacher->id,
            'title'       => 'Sample Course',
            'description' => 'A great course',
            'price'       => 150,
            'category'    => 'Tech',
        ], $overrides));
    }

    // ── Admin: Course CRUD ─────────────────────────────────────────────────────

    public function test_admin_can_create_a_course(): void
    {
        $admin   = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/courses', [
            'teacher_id'   => $teacher->id,
            'title'        => 'New Course',
            'description'  => 'Course description',
            'price'        => 200,
            'category'     => 'Design',
            'capacity'     => 30,
            'duration'     => '4 weeks',
            'created_date' => '2026-01-01',
            'ended_date'   => '2026-01-31',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'course']);

        $this->assertDatabaseHas('courses', ['title' => 'New Course']);
    }

    public function test_non_admin_cannot_create_a_course(): void
    {
        $learner = User::factory()->create(); // role = learner
        $teacher = User::factory()->teacher()->create();

        Sanctum::actingAs($learner);

        $this->postJson('/api/courses', [
            'teacher_id'  => $teacher->id,
            'title'       => 'Unauthorized Course',
            'description' => 'Should fail',
            'price'       => 100,
        ])->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_create_a_course(): void
    {
        $teacher = User::factory()->teacher()->create();

        $this->postJson('/api/courses', [
            'teacher_id'  => $teacher->id,
            'title'       => 'No Auth Course',
            'description' => 'Should fail',
            'price'       => 100,
        ])->assertStatus(401);
    }

    public function test_admin_can_list_all_courses(): void
    {
        $admin   = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $this->makeCourse($teacher);
        $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/courses');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'courses');
    }

    public function test_non_admin_cannot_list_all_courses(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/courses')->assertStatus(403);
    }

    public function test_admin_can_view_a_single_course(): void
    {
        $admin   = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/courses/{$course->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('course.id', $course->id);
    }

    public function test_admin_can_update_a_course(): void
    {
        $admin   = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/courses/{$course->id}", [
            'title' => 'Updated Title',
            'price' => 300,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('course.title', 'Updated Title');

        $this->assertDatabaseHas('courses', ['id' => $course->id, 'title' => 'Updated Title']);
    }

    public function test_admin_can_delete_a_course(): void
    {
        $admin   = User::factory()->admin()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $this->deleteJson("/api/courses/{$course->id}")
             ->assertStatus(200)
             ->assertJson(['message' => 'Course deleted successfully']);

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    public function test_returns_404_for_nonexistent_course(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/courses/99999')->assertStatus(404);
    }

    // ── Public: Course Details ─────────────────────────────────────────────────

    public function test_anyone_can_view_course_details_without_auth(): void
    {
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        $response = $this->getJson("/api/courses/{$course->id}/details");

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonPath('course.id', $course->id);
    }

    public function test_course_details_includes_teacher_reviews_sections_outcomes(): void
    {
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        $response = $this->getJson("/api/courses/{$course->id}/details");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'course' => ['teacher', 'reviews', 'sections', 'outcomes'],
                 ]);
    }

    public function test_course_details_returns_404_for_nonexistent_course(): void
    {
        $this->getJson('/api/courses/99999/details')->assertStatus(404);
    }

    // ── Validation ────────────────────────────────────────────────────────────

    public function test_create_course_fails_without_required_fields(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/courses', [
            'title' => 'Missing Fields Course',
        ])->assertStatus(422);
    }

    public function test_create_course_fails_with_invalid_teacher_id(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/courses', [
            'teacher_id'  => 99999,
            'title'       => 'Bad Teacher',
            'description' => 'Desc',
            'price'       => 100,
        ])->assertStatus(422);
    }
}
