<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    private function makeTeacherWithCourse(string $courseName = 'Laravel Basics'): array
    {
        $teacher = User::factory()->teacher()->create(['name' => 'Teacher ' . $courseName]);
        $course  = Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => $courseName,
            'description' => 'Learn all about ' . $courseName,
            'price'       => 100,
            'category'    => 'Tech',
        ]);
        return [$teacher, $course];
    }

    public function test_authenticated_user_can_search(): void
    {
        $user = User::factory()->create();
        $this->makeTeacherWithCourse('Python for Beginners');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=Python');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => ['query', 'courses', 'teachers', 'skills', 'total_results'],
                 ]);
    }

    public function test_search_requires_authentication(): void
    {
        $this->getJson('/api/search?q=Python')->assertStatus(401);
    }

    public function test_search_requires_q_parameter(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/search')->assertStatus(422);
    }

    public function test_search_finds_courses_by_title(): void
    {
        $user = User::factory()->create();
        $this->makeTeacherWithCourse('Advanced Laravel');
        $this->makeTeacherWithCourse('Vue.js Basics');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=Laravel');
        $response->assertStatus(200);

        $courses = $response->json('data.courses');
        $this->assertCount(1, $courses);
        $this->assertEquals('course', $courses[0]['type']);
    }

    public function test_search_finds_teachers_by_name(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create(['name' => 'Mohammed Ahmed']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=Mohammed');
        $response->assertStatus(200);

        $teachers = $response->json('data.teachers');
        $this->assertCount(1, $teachers);
        $this->assertEquals('teacher', $teachers[0]['type']);
    }

    public function test_search_finds_skills_by_name(): void
    {
        $user = User::factory()->create();
        Skill::create(['name' => 'GraphQL']);
        Skill::create(['name' => 'Docker']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=Graph');
        $response->assertStatus(200);

        $skills = $response->json('data.skills');
        $this->assertCount(1, $skills);
        $this->assertEquals('skill', $skills[0]['type']);
    }

    public function test_search_returns_empty_when_nothing_matches(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=xyznonexistent');
        $response->assertStatus(200)
                 ->assertJsonPath('data.total_results', 0)
                 ->assertJsonCount(0, 'data.courses')
                 ->assertJsonCount(0, 'data.teachers')
                 ->assertJsonCount(0, 'data.skills');
    }

    public function test_search_respects_limit_parameter(): void
    {
        $user = User::factory()->create();

        for ($i = 1; $i <= 5; $i++) {
            $this->makeTeacherWithCourse("Laravel Course {$i}");
        }

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/search?q=Laravel&limit=2');
        $response->assertStatus(200);

        $courses = $response->json('data.courses');
        $this->assertCount(2, $courses);
    }

    public function test_search_validates_limit_range(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/search?q=test&limit=100')->assertStatus(422);
        $this->getJson('/api/search?q=test&limit=0')->assertStatus(422);
    }

    public function test_search_q_cannot_be_empty(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/search?q=')->assertStatus(422);
    }
}
