<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeachController extends Controller{
    public function index(Request $request)
    {
        $teacher = $request->user();

       $totalCourses = DB::table('courses')
            ->where('teacher_id', $teacher->id)
            ->count();

        $totalStudents = DB::table('enrollments')
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->where('courses.teacher_id', $teacher->id)
            ->distinct('enrollments.user_id')
            ->count('enrollments.user_id');

        $averageRating = DB::table('reviews')
            ->join('courses', 'courses.id', '=', 'reviews.course_id')
            ->where('courses.teacher_id', $teacher->id)
            ->avg('reviews.rating');

        $totalEarnings = DB::table('payments')
    ->join('courses', 'courses.id', '=', 'payments.service_id')
    ->where('payments.service_type', 'course')
    ->where('courses.teacher_id', $teacher->id)
    ->sum('payments.amount');

        $courses = DB::table('courses')
            ->where('teacher_id', $teacher->id)
            ->select('id', 'title', 'category', 'price')
            ->get()
            ->map(function ($c) {
                $c->students   = DB::table('enrollments')->where('course_id', $c->id)->whereIn('status', ['enrolled','completed'])->count();
                $c->avg_rating = round(DB::table('reviews')->where('course_id', $c->id)->avg('rating') ?? 0, 1);
                return $c;
            });

        $recentReviews = DB::table('reviews')
            ->join('courses', 'courses.id', '=', 'reviews.course_id')
            ->leftJoin('users', 'users.id', '=', 'reviews.user_id')
            ->where('courses.teacher_id', $teacher->id)
            ->select('reviews.*', 'users.name as user_name', 'courses.title as course_title')
            ->latest('reviews.created_at')
            ->take(5)
            ->get()
            ->map(function ($r) {
                $r->user = (object)['name' => $r->user_name];
                return $r;
            });

        return response()->json([
            'success' => true,

            'stats' => [
                'total_courses' => $totalCourses,
                'total_students' => $totalStudents,
                'average_rating' => round($averageRating ?? 0, 1),
                'total_earnings' => $totalEarnings,
            ],

            'my_courses' => $courses,

            'recent_reviews' => $recentReviews,
        ]);
    }
}