<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserDashboardTest extends TestCase
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

    // ── User Dashboard ────────────────────────────────────────────────────────

    public function test_authenticated_user_can_view_their_dashboard(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => [
                         'stats' => [
                             'enrolled_courses',
                             'teaching_courses',
                             'exchange_matches',
                             'upcoming_sessions',
                             'points',
                         ],
                         'continue_learning',
                         'my_teaching_courses',
                         'upcoming_sessions_list',
                         'recent_activity',
                     ],
                 ]);
    }

    public function test_user_dashboard_stats_reflect_actual_data(): void
    {
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        $course1 = $this->makeCourse($teacher);
        $course2 = $this->makeCourse($teacher);

        Enrollment::create(['user_id' => $learner->id, 'course_id' => $course1->id, 'status' => 'enrolled', 'progress' => 0]);
        Enrollment::create(['user_id' => $learner->id, 'course_id' => $course2->id, 'status' => 'enrolled', 'progress' => 0]);

        Sanctum::actingAs($learner);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200)
                 ->assertJsonPath('data.stats.enrolled_courses', 2);
    }

    public function test_user_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/user/dashboard')->assertStatus(401);
    }

    // ── Teacher Dashboard ─────────────────────────────────────────────────────

    public function test_teacher_can_view_their_dashboard(): void
    {
        $teacher = User::factory()->teacher()->create();
        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/teacher/dashboard');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'stats' => ['total_courses', 'total_students', 'average_rating', 'total_earnings'],
                     'my_courses',
                     'recent_reviews',
                 ]);
    }

    public function test_teacher_dashboard_shows_only_their_courses(): void
    {
        $teacherA = User::factory()->teacher()->create();
        $teacherB = User::factory()->teacher()->create();

        $this->makeCourse($teacherA);
        $this->makeCourse($teacherA);
        $this->makeCourse($teacherB);

        Sanctum::actingAs($teacherA);

        $response = $this->getJson('/api/teacher/dashboard');
        $response->assertStatus(200);

        $myCourses = $response->json('my_courses');
        $this->assertCount(2, $myCourses);
    }

    public function test_teacher_dashboard_requires_authentication(): void
    {
        $this->getJson('/api/teacher/dashboard')->assertStatus(401);
    }

    // ── Explore Courses ───────────────────────────────────────────────────────

    public function test_authenticated_user_can_explore_courses(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $this->makeCourse($teacher);
        $this->makeCourse($teacher);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/explore/courses');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonCount(2, 'courses');
    }

    public function test_explore_courses_can_filter_by_category(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        Course::create(['teacher_id' => $teacher->id, 'title' => 'Design Course', 'description' => 'D', 'price' => 100, 'category' => 'Design']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'Tech Course',   'description' => 'D', 'price' => 100, 'category' => 'Tech']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/explore/courses?category=Design');
        $response->assertStatus(200);

        $courses = $response->json('courses');
        $this->assertCount(1, $courses);
        $this->assertEquals('Design Course', $courses[0]['title']);
    }

    public function test_explore_courses_can_filter_by_search(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        Course::create(['teacher_id' => $teacher->id, 'title' => 'PHP Mastery',  'description' => 'D', 'price' => 100, 'category' => 'Tech']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'Vue.js Intro', 'description' => 'D', 'price' => 100, 'category' => 'Tech']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/explore/courses?search=PHP');
        $response->assertStatus(200);

        $this->assertCount(1, $response->json('courses'));
    }

    public function test_explore_courses_can_filter_by_price_range(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        Course::create(['teacher_id' => $teacher->id, 'title' => 'Cheap',     'description' => 'D', 'price' => 50,  'category' => 'Tech']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'Mid',       'description' => 'D', 'price' => 150, 'category' => 'Tech']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'Expensive', 'description' => 'D', 'price' => 500, 'category' => 'Tech']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/explore/courses?min_price=100&max_price=200');
        $response->assertStatus(200);

        $this->assertCount(1, $response->json('courses'));
    }

    public function test_explore_requires_authentication(): void
    {
        $this->getJson('/api/explore/courses')->assertStatus(401);
    }

    // ── Explore Categories ────────────────────────────────────────────────────

    public function test_user_can_list_course_categories(): void
    {
        $user    = User::factory()->create();
        $teacher = User::factory()->teacher()->create();

        Course::create(['teacher_id' => $teacher->id, 'title' => 'C1', 'description' => 'D', 'price' => 100, 'category' => 'Tech']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'C2', 'description' => 'D', 'price' => 100, 'category' => 'Tech']);
        Course::create(['teacher_id' => $teacher->id, 'title' => 'C3', 'description' => 'D', 'price' => 100, 'category' => 'Design']);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/explore/categories');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $categories = $response->json('categories');
        $this->assertCount(2, $categories);

        $techCategory = collect($categories)->firstWhere('category', 'Tech');
        $this->assertEquals(2, $techCategory['total']);
    }

    public function test_categories_requires_authentication(): void
    {
        $this->getJson('/api/explore/categories')->assertStatus(401);
    }
}
