<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Review;
use App\Models\Exchange;
use App\Models\UserSkill;
use App\Models\Enrollment;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $user->id,
            'gender' => 'sometimes|in:male,female',
            'date_of_birth' => 'sometimes|date',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user,
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        $coursesEnrolled = Enrollment::where('user_id', $user->id)
            ->where('status', 'enrolled')
            ->count();

        $coursesTeaching = Course::where('teacher_id', $user->id)
            ->count();

        $skillsLearned = UserSkill::where('user_id', $user->id)
            ->where('type', 'learn')
            ->count();

        $sessionsCompleted = Enrollment::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $averageRating = Review::where('user_id', $user->id)
            ->avg('rating') ?? 0;

        $exchangesDone = Exchange::where(function ($query) use ($user) {
                $query->where('requester_id', $user->id)
                      ->orWhere('partner_id', $user->id);
            })
            ->where('status', 'completed')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'courses_enrolled' => $coursesEnrolled,
                'courses_teaching' => $coursesTeaching,
                'skills_learned' => $skillsLearned,
                'sessions_completed' => $sessionsCompleted,
                'average_rating' => round($averageRating, 1),
                'exchanges_done' => $exchangesDone,
            ]
        ]);
    }

    public function achievements(Request $request)
    {
        $user = $request->user();

        $achievements = [];

        $coursesTeaching = Course::where('teacher_id', $user->id)->count();

        if ($coursesTeaching >= 5) {
            $achievements[] = [
                'title' => 'Top Instructor',
                'description' => 'Taught 5+ courses'
            ];
        }

        $teachingCourseIds = Course::where('teacher_id', $user->id)->pluck('id');
        $averageRating = $teachingCourseIds->isNotEmpty()
            ? (Review::whereIn('course_id', $teachingCourseIds)->avg('rating') ?? 0)
            : 0;

        if ($averageRating >= 4) {
            $achievements[] = [
                'title' => 'Helpful Teacher',
                'description' => 'Average rating above 4'
            ];
        }

        $completedCourses = Enrollment::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        if ($completedCourses >= 3) {
            $achievements[] = [
                'title' => 'Consistent Learner',
                'description' => 'Completed 3+ courses'
            ];
        }

        $exchangesDone = Exchange::where(function ($query) use ($user) {
                $query->where('requester_id', $user->id)
                      ->orWhere('partner_id', $user->id);
            })
            ->where('status', 'completed')
            ->count();

        if ($exchangesDone >= 1) {
            $achievements[] = [
                'title' => 'Rising Star',
                'description' => 'Completed first exchange'
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $achievements
        ]);
    }

    public function reviews(Request $request)
    {
        $user = $request->user();

        $reviews = Review::with('course:id,title')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }
}