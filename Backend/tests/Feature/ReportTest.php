<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function makeCourse(User $teacher): Course
    {
        return Course::create([
            'teacher_id'  => $teacher->id,
            'title'       => 'Reported Course',
            'description' => 'Desc',
            'price'       => 100,
            'category'    => 'Tech',
        ]);
    }

    private function makeReport(User $user, Course $course, array $overrides = []): Report
    {
        return Report::create(array_merge([
            'user_id'   => $user->id,
            'course_id' => $course->id,
            'reason'    => 'Inappropriate content',
            'status'    => 'pending',
            'date'      => now(),
        ], $overrides));
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_admin_can_list_all_reports(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $this->makeReport($learner, $course);
        $this->makeReport($learner, $course);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/reports');

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'reports'])
                 ->assertJsonCount(2, 'reports');
    }

    public function test_non_admin_cannot_list_reports(): void
    {
        $learner = User::factory()->create();
        Sanctum::actingAs($learner);

        $this->getJson('/api/reports')->assertStatus(403);
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_admin_can_create_a_report(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/reports', [
            'user_id'     => $learner->id,
            'course_id'   => $course->id,
            'reason'      => 'Spam',
            'description' => 'This course contains spam',
            'status'      => 'pending',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Report created successfully']);

        $this->assertDatabaseHas('reports', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'reason'    => 'Spam',
        ]);
    }

    public function test_report_requires_user_id_and_course_id(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/reports', [
            'reason' => 'Missing IDs',
        ])->assertStatus(422);
    }

    public function test_report_status_must_be_valid(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);

        Sanctum::actingAs($admin);

        $this->postJson('/api/reports', [
            'user_id'   => $learner->id,
            'course_id' => $course->id,
            'reason'    => 'Bad content',
            'status'    => 'invalid_status',
        ])->assertStatus(422);
    }

    // ── Show ──────────────────────────────────────────────────────────────────

    public function test_admin_can_view_a_single_report(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $report  = $this->makeReport($learner, $course);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/reports/{$report->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('report.id', $report->id);
    }

    public function test_report_show_returns_404_for_nonexistent_id(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $this->getJson('/api/reports/99999')->assertStatus(404);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_admin_can_update_report_status(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $report  = $this->makeReport($learner, $course, ['status' => 'pending']);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/reports/{$report->id}", [
            'status' => 'approved',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Report updated successfully']);

        $this->assertDatabaseHas('reports', ['id' => $report->id, 'status' => 'approved']);
    }

    public function test_report_update_rejects_invalid_status(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $report  = $this->makeReport($learner, $course);

        Sanctum::actingAs($admin);

        $this->putJson("/api/reports/{$report->id}", [
            'status' => 'resolved',
        ])->assertStatus(422);
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    public function test_admin_can_delete_a_report(): void
    {
        $admin   = User::factory()->admin()->create();
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $report  = $this->makeReport($learner, $course);

        Sanctum::actingAs($admin);

        $this->deleteJson("/api/reports/{$report->id}")
             ->assertStatus(200)
             ->assertJson(['message' => 'Report deleted successfully']);

        $this->assertDatabaseMissing('reports', ['id' => $report->id]);
    }

    public function test_non_admin_cannot_delete_report(): void
    {
        $learner = User::factory()->create();
        $teacher = User::factory()->teacher()->create();
        $course  = $this->makeCourse($teacher);
        $report  = $this->makeReport($learner, $course);

        Sanctum::actingAs($learner);

        $this->deleteJson("/api/reports/{$report->id}")->assertStatus(403);
    }
}
