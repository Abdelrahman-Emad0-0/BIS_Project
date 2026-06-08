<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    public function enroll(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $enrollment = Enrollment::updateOrCreate(
            [
                'user_id'   => $request->user()->id,
                'course_id' => $validated['course_id'],
            ],
            [
                'status'   => 'enrolled',
                'progress' => 0,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Enrolled successfully',
            'data'    => $enrollment,
        ], 201);
    }

    public function completed(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $enrollment = Enrollment::updateOrCreate(
            [
                'user_id'   => $request->user()->id,
                'course_id' => $validated['course_id'],
            ],
            [
                'status'   => 'completed',
                'progress' => 100,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Marked as completed',
            'data'    => $enrollment,
        ]);
    }

    public function wishlist(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $enrollment = Enrollment::updateOrCreate(
            [
                'user_id'   => $request->user()->id,
                'course_id' => $validated['course_id'],
            ],
            [
                'status'   => 'wishlist',
                'progress' => 0,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Added to wishlist',
            'data' => $enrollment,
        ]);
    }

    public function enrolledCourses(Request $request)
    {
        $userId = auth()->id();

        $courses = Enrollment::with('course.teacher')
            ->where('user_id', $userId)
            ->where('status', 'enrolled')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function completedCourses(Request $request)
    {
        $userId = auth()->id();

        $courses = Enrollment::with('course.teacher')
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function wishlistCourses(Request $request)
    {
        $userId = auth()->id();

        $courses = Enrollment::with('course.teacher')
            ->where('user_id', $userId)
            ->where('status', 'wishlist')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function teachingCourses(Request $request)
    {
        $courses = Course::with('teacher')
            ->where('teacher_id', auth()->id())
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function searchMyCourses(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string',
        ]);

        $courses = Enrollment::with('course.teacher')
            ->where('user_id', auth()->id())
            ->whereHas('course', function ($query) use ($validated) {
                $query->where('title', 'like', '%' . $validated['q'] . '%');
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }
public function continueLearning()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated',
        ], 401);
    }

    $enrollment = Enrollment::with('course.teacher')
        ->where('user_id', $user->id)
        ->where('status', 'enrolled')
        ->where('progress', '<', 100)
        ->orderByDesc('updated_at')
        ->first();

    if (!$enrollment) {
        return response()->json([
            'success' => true,
            'message' => 'No active course found',
            'data' => null,
        ], 200);
    }

    return response()->json([
        'success' => true,
        'message' => 'Continue learning course retrieved successfully',
        'data' => [
            'enrollment_id' => $enrollment->id,
            'course_id' => $enrollment->course->id,
            'course_title' => $enrollment->course->title,
            'teacher_name' => $enrollment->course->teacher->name ?? null,
            'progress' => $enrollment->progress,
            'status' => $enrollment->status,
            'last_activity' => $enrollment->updated_at,
            'course' => $enrollment->course,
        ],
    ], 200);
}
}