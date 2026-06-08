<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeacherAccountTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(User $teacher): Course
    {
        return Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'My Course',
            'description' => 'Desc',
            'price'       => 100,
            'category'    => 'Tech',
        ]);
    }

    // ── Account Info: New Teacher Registration (no token) ────────────────────

    public function test_new_teacher_can_register_via_teacher_portal(): void
    {
        $response = $this->postJson('/api/teacher/account-info', [
            'name'                  => 'Sara Ahmed',
            'email'                 => 'sara@teacher.com',
            'phone'                 => '01011223344',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'female',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Teacher account created successfully'])
                 ->assertJsonStructure(['token', 'data']);

        $this->assertDatabaseHas('users', [
            'email' => 'sara@teacher.com',
            'role'  => 'teacher',
        ]);
    }

    public function test_teacher_registration_returns_token(): void
    {
        $response = $this->postJson('/api/teacher/account-info', [
            'name'                  => 'Ahmed Teacher',
            'email'                 => 'ahmed@teacher.com',
            'phone'                 => '01099887766',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
        ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('token'));
    }

    public function test_teacher_registration_requires_all_fields(): void
    {
        $this->postJson('/api/teacher/account-info', [
            'name' => 'Incomplete',
        ])->assertStatus(422);
    }

    public function test_teacher_registration_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'dup@teacher.com']);

        $this->postJson('/api/teacher/account-info', [
            'name'                  => 'Duplicate',
            'email'                 => 'dup@teacher.com',
            'phone'                 => '01055554444',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
        ])->assertStatus(422);
    }

    public function test_teacher_registration_always_assigns_teacher_role(): void
    {
        $response = $this->postJson('/api/teacher/account-info', [
            'name'                  => 'Role Test',
            'email'                 => 'roletest@teacher.com',
            'phone'                 => '01066665555',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'gender'                => 'male',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'roletest@teacher.com',
            'role'  => 'teacher',
        ]);
    }

    // ── Account Info: Existing Teacher Update (has token) ─────────────────────

    public function test_authenticated_teacher_can_update_their_name(): void
    {
        $teacher = User::factory()->teacher()->create(['name' => 'Old Name']);
        Sanctum::actingAs($teacher);

        $response = $this->postJson('/api/teacher/account-info', [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true, 'message' => 'Teacher account info updated successfully']);

        $this->assertDatabaseHas('users', ['id' => $teacher->id, 'name' => 'New Name']);
    }

    public function test_authenticated_teacher_can_update_password(): void
    {
        $teacher = User::factory()->teacher()->create();
        Sanctum::actingAs($teacher);

        $response = $this->postJson('/api/teacher/account-info', [
            'password'              => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_authenticated_teacher_update_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $teacher = User::factory()->teacher()->create();

        Sanctum::actingAs($teacher);

        $this->postJson('/api/teacher/account-info', [
            'email' => 'taken@example.com',
        ])->assertStatus(422);
    }

    // ── Bio ───────────────────────────────────────────────────────────────────

    public function test_teacher_can_save_bio(): void
    {
        $teacher = User::factory()->teacher()->create();
        Sanctum::actingAs($teacher);

        $response = $this->postJson('/api/teacher/bio', [
            'bio'            => 'I am an experienced developer.',
            'experience'     => '5 years in Laravel',
            'qualifications' => 'BSc Computer Science',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['success' => true, 'message' => 'Teacher bio saved successfully']);

        $this->assertDatabaseHas('teacher_profiles', [
            'user_id' => $teacher->id,
            'bio'     => 'I am an experienced developer.',
        ]);
    }

    public function test_teacher_bio_updates_instead_of_duplicating(): void
    {
        $teacher = User::factory()->teacher()->create();
        Sanctum::actingAs($teacher);

        $this->postJson('/api/teacher/bio', ['bio' => 'First bio']);
        $this->postJson('/api/teacher/bio', ['bio' => 'Updated bio']);

        $count = \App\Models\TeacherProfile::where('user_id', $teacher->id)->count();
        $this->assertEquals(1, $count);

        $this->assertDatabaseHas('teacher_profiles', [
            'user_id' => $teacher->id,
            'bio'     => 'Updated bio',
        ]);
    }

    public function test_bio_requires_authentication(): void
    {
        $this->postJson('/api/teacher/bio', ['bio' => 'Test'])->assertStatus(401);
    }

    // ── Overview ──────────────────────────────────────────────────────────────

    public function test_teacher_can_get_their_overview(): void
    {
        $teacher = User::factory()->teacher()->create();
        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/teacher/overview');

        $response->assertStatus(200)
                 ->assertJson(['success' => true])
                 ->assertJsonStructure([
                     'data' => ['total_courses', 'total_students', 'average_rating', 'total_earnings'],
                 ]);
    }

    public function test_teacher_overview_counts_only_their_courses(): void
    {
        $teacherA = User::factory()->teacher()->create();
        $teacherB = User::factory()->teacher()->create();

        $this->makeCourse($teacherA);
        $this->makeCourse($teacherA);
        $this->makeCourse($teacherB); // should not count for teacherA

        Sanctum::actingAs($teacherA);

        $response = $this->getJson('/api/teacher/overview');
        $response->assertStatus(200)
                 ->assertJsonPath('data.total_courses', 2);
    }

    public function test_teacher_earnings_counts_payments_on_their_courses(): void
    {
        $teacher = User::factory()->teacher()->create();
        $learner = User::factory()->create();
        $course  = $this->makeCourse($teacher);

        // Payment made FOR teacher's course
        Payment::create([
            'user_id'        => $learner->id,
            'amount'         => 150,
            'payment_method' => 'cash',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => $course->id,
            'date'           => now(),
        ]);

        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/teacher/overview');
        $response->assertStatus(200)
                 ->assertJsonPath('data.total_earnings', 150);
    }

    public function test_teacher_earnings_excludes_payments_by_teacher_as_buyer(): void
    {
        $teacher        = User::factory()->teacher()->create();
        $anotherTeacher = User::factory()->teacher()->create();
        $otherCourse    = $this->makeCourse($anotherTeacher);

        // Teacher paid FOR someone else's course — should NOT count as earnings
        Payment::create([
            'user_id'        => $teacher->id,
            'amount'         => 200,
            'payment_method' => 'cash',
            'currency'       => 'EGP',
            'status'         => 'completed',
            'service_type'   => 'course',
            'service_id'     => $otherCourse->id,
            'date'           => now(),
        ]);

        Sanctum::actingAs($teacher);

        $response = $this->getJson('/api/teacher/overview');
        $response->assertStatus(200)
                 ->assertJsonPath('data.total_earnings', 0);
    }

    public function test_overview_requires_authentication(): void
    {
        $this->getJson('/api/teacher/overview')->assertStatus(401);
    }
}
