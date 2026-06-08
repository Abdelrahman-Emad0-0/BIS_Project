<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Report;
use App\Models\Review;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $now = now();
        $weekAgo = $now->copy()->subWeek();

        // Stats
        $totalStudents   = User::whereIn('role', ['learner','both'])->count();
        $totalTeachers   = User::whereIn('role', ['teacher','both'])->count();
        $totalCourses    = Course::count();
        $totalEnroll     = Enrollment::count();
        $totalRevenue    = Payment::where('status', 'completed')->sum('amount');

        // Weekly changes
        $newStudentsWk   = User::whereIn('role', ['learner','both'])->where('created_at', '>=', $weekAgo)->count();
        $newTeachersWk   = User::whereIn('role', ['teacher','both'])->where('created_at', '>=', $weekAgo)->count();
        $newCoursesWk    = Course::where('created_at', '>=', $weekAgo)->count();
        $revenueWk       = Payment::where('status', 'completed')->where('created_at', '>=', $weekAgo)->sum('amount');

        // Recent Activities
        $activities = collect();
        $activities = $activities->merge(
            User::latest()->take(3)->get()->map(fn($u) => [
                'type' => 'user', 'icon' => 'fa-user-plus', 'color' => 'bg-purple-100 text-purple-600',
                'message' => 'New user registered: ' . $u->name,
                'date' => $u->created_at,
                'ago'  => Carbon::parse($u->created_at)->diffForHumans(),
            ])
        );
        $activities = $activities->merge(
            Course::latest()->take(2)->get()->map(fn($c) => [
                'type' => 'course', 'icon' => 'fa-book', 'color' => 'bg-green-100 text-green-600',
                'message' => 'New course submitted: ' . $c->title,
                'date' => $c->created_at,
                'ago'  => Carbon::parse($c->created_at)->diffForHumans(),
            ])
        );
        $activities = $activities->merge(
            Payment::where('status','completed')->latest()->take(2)->get()->map(fn($p) => [
                'type' => 'payment', 'icon' => 'fa-dollar-sign', 'color' => 'bg-yellow-100 text-yellow-600',
                'message' => 'Payment received: EGP ' . number_format($p->amount, 0),
                'date' => $p->created_at,
                'ago'  => Carbon::parse($p->created_at)->diffForHumans(),
            ])
        );
        $activities = $activities->merge(
            Report::latest()->take(2)->get()->map(fn($r) => [
                'type' => 'report', 'icon' => 'fa-flag', 'color' => 'bg-red-100 text-red-600',
                'message' => 'New report submitted',
                'date' => $r->created_at,
                'ago'  => Carbon::parse($r->created_at)->diffForHumans(),
            ])
        );
        $recentActivities = $activities->sortByDesc('date')->values()->take(6);

        // Revenue by day (last 7 days for chart)
        $revenueChart = collect(range(6, 0))->map(function ($daysAgo) {
            $day = now()->subDays($daysAgo);
            $amount = Payment::where('status', 'completed')
                ->whereDate('created_at', $day->toDateString())
                ->sum('amount');
            return ['day' => $day->format('D'), 'amount' => (float) $amount];
        });

        // Latest Users
        $latestUsers = User::latest()->take(5)->get(['id','name','email','role','created_at']);

        // Recent Courses
        $recentCourses = DB::table('courses')
            ->leftJoin('users', 'users.id', '=', 'courses.teacher_id')
            ->select('courses.*', 'users.name as teacher_name')
            ->latest('courses.created_at')
            ->take(5)
            ->get()
            ->map(function ($c) {
                $c->students = DB::table('enrollments')->where('course_id', $c->id)->count();
                return $c;
            });

        // Recent Reports
        $recentReports = Report::with(['user'])->latest()->take(4)->get();

        return response()->json([
            'stats' => [
                'total_students'   => $totalStudents,
                'total_teachers'   => $totalTeachers,
                'total_courses'    => $totalCourses,
                'total_enrollments'=> $totalEnroll,
                'total_revenue'    => (float) $totalRevenue,
                'new_students_week'=> $newStudentsWk,
                'new_teachers_week'=> $newTeachersWk,
                'new_courses_week' => $newCoursesWk,
                'revenue_week'     => (float) $revenueWk,
            ],
            'recent_activities' => $recentActivities,
            'revenue_chart'     => $revenueChart,
            'latest_users'      => $latestUsers,
            'recent_courses'    => $recentCourses,
            'recent_reports'    => $recentReports,
        ]);
    }
}
