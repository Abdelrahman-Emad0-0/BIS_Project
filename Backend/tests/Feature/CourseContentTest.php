<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseContentTest extends TestCase
{
    use RefreshDatabase;

    private function makeTeacherAndCourse(): array
    {
        $teacher = User::factory()->teacher()->create();
        $course  = Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Test Course',
            'description' => 'Desc',
            'price'       => 100,
            'category'    => 'Tech',
        ]);
        return [$teacher, $course];
    }

    private function makeSection(Course $course, string $title = 'Section 1'): CourseSection
    {
        return CourseSection::create([
            'course_id'  => $course->id,
            'title'      => $title,
            'sort_order' => 1,
        ]);
    }

    // ── Course Sections ───────────────────────────────────────────────────────

    public function test_authenticated_user_can_add_section_to_course(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        Sanctum::actingAs($teacher);

        $response = $this->postJson("/api/courses/{$course->id}/sections", [
            'title'      => 'Introduction',
            'sort_order' => 1,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['section']);

        $this->assertDatabaseHas('course_sections', [
            'course_id' => $course->id,
            'title'     => 'Introduction',
        ]);
    }

    public function test_section_requires_title(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        Sanctum::actingAs($teacher);

        $this->postJson("/api/courses/{$course->id}/sections", [])
             ->assertStatus(422);
    }

    public function test_section_returns_404_for_nonexistent_course(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/courses/99999/sections', [
            'title' => 'Section',
        ])->assertStatus(404);
    }

    public function test_section_creation_requires_authentication(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();

        $this->postJson("/api/courses/{$course->id}/sections", [
            'title' => 'Intro',
        ])->assertStatus(401);
    }

    // ── Course Lessons ────────────────────────────────────────────────────────

    public function test_authenticated_user_can_add_lesson_to_section(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        $section = $this->makeSection($course);

        Sanctum::actingAs($teacher);

        $response = $this->postJson("/api/sections/{$section->id}/lessons", [
            'title'       => 'Lesson 1: Intro',
            'type'        => 'video',
            'duration'    => '10:00',
            'content_url' => 'https://example.com/video.mp4',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['lesson']);

        $this->assertDatabaseHas('course_lessons', [
            'section_id' => $section->id,
            'title'      => 'Lesson 1: Intro',
            'type'       => 'video',
        ]);
    }

    public function test_lesson_requires_title_and_type(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        $section = $this->makeSection($course);

        Sanctum::actingAs($teacher);

        $this->postJson("/api/sections/{$section->id}/lessons", [])
             ->assertStatus(422);
    }

    public function test_lesson_returns_404_for_nonexistent_section(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/sections/99999/lessons', [
            'title' => 'Lesson',
            'type'  => 'video',
        ])->assertStatus(404);
    }

    public function test_lesson_creation_requires_authentication(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        $section = $this->makeSection($course);

        $this->postJson("/api/sections/{$section->id}/lessons", [
            'title' => 'Lesson',
            'type'  => 'video',
        ])->assertStatus(401);
    }

    // ── Course Outcomes ───────────────────────────────────────────────────────

    public function test_authenticated_user_can_add_outcome_to_course(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        Sanctum::actingAs($teacher);

        $response = $this->postJson("/api/courses/{$course->id}/outcomes", [
            'outcome' => 'You will learn to build REST APIs',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure(['outcome']);

        $this->assertDatabaseHas('course_outcomes', [
            'course_id' => $course->id,
            'outcome'   => 'You will learn to build REST APIs',
        ]);
    }

    public function test_outcome_requires_outcome_field(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        Sanctum::actingAs($teacher);

        $this->postJson("/api/courses/{$course->id}/outcomes", [])
             ->assertStatus(422);
    }

    public function test_outcome_returns_404_for_nonexistent_course(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/courses/99999/outcomes', [
            'outcome' => 'Learn something',
        ])->assertStatus(404);
    }

    public function test_multiple_outcomes_can_be_added_to_same_course(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();
        Sanctum::actingAs($teacher);

        $this->postJson("/api/courses/{$course->id}/outcomes", ['outcome' => 'Outcome 1']);
        $this->postJson("/api/courses/{$course->id}/outcomes", ['outcome' => 'Outcome 2']);
        $this->postJson("/api/courses/{$course->id}/outcomes", ['outcome' => 'Outcome 3']);

        $count = \App\Models\CourseOutcome::where('course_id', $course->id)->count();
        $this->assertEquals(3, $count);
    }

    public function test_outcome_creation_requires_authentication(): void
    {
        [$teacher, $course] = $this->makeTeacherAndCourse();

        $this->postJson("/api/courses/{$course->id}/outcomes", [
            'outcome' => 'Something',
        ])->assertStatus(401);
    }
}
