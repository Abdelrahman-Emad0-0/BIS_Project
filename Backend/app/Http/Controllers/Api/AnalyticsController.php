<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,

            'analytics' => [

                'users' => [
                    'total' => DB::table('users')->count(),
                    'students' => DB::table('users')->where('role', 'learner')->count(),
                    'teachers' => DB::table('users')->where('role', 'teacher')->count(),
                    'admins' => DB::table('users')->where('role', 'admin')->count(),
                ],

                'courses' => [
                    'total' => DB::table('courses')->count(),
                ],

                'enrollments' => [
                    'total' => DB::table('enrollments')->count(),
                ],

                'payments' => [
                    'total_transactions' => DB::table('payments')->count(),
                    'total_revenue' => DB::table('payments')->sum('amount'),
                ],

                'reviews' => [
                    'total_reviews' => DB::table('reviews')->count(),
                    'average_rating' => round(
                        DB::table('reviews')->avg('rating') ?? 0,
                        2
                    ),
                ],

                'exchanges' => [
                    'total_matches' => DB::table('exchanges')->count(),
                ],

                'sessions' => [
                    'total_sessions' => DB::table('calendar_sessions')->count(),
                ],
            ]
        ]);
    }
}