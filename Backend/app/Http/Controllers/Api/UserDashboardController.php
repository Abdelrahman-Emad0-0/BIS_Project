<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $now  = now();

        // ── Stats ───────────────────────────────────────────────────────────
        $enrolledCourses  = DB::table('enrollments')->where('user_id', $user->id)->whereIn('status', ['enrolled','completed'])->count();
        $inProgress       = DB::table('enrollments')->where('user_id', $user->id)->where('status','enrolled')->where('progress','<',100)->count();
        $teachingCourses  = DB::table('courses')->where('teacher_id', $user->id)->count();
        $teachingStudents = DB::table('enrollments')->join('courses','courses.id','=','enrollments.course_id')->where('courses.teacher_id',$user->id)->distinct('enrollments.user_id')->count('enrollments.user_id');
        $exchangeMatches  = DB::table('exchanges')->where(function($q) use($user){ $q->where('requester_id',$user->id)->orWhere('partner_id',$user->id); })->count();
        $activeExchanges  = DB::table('exchanges')->where(function($q) use($user){ $q->where('requester_id',$user->id)->orWhere('partner_id',$user->id); })->where('status','active')->count();
        $upcomingSessions = DB::table('calendar_sessions')->where(function($q) use($user){ $q->where('student_id',$user->id)->orWhere('instructor_id',$user->id); })->where('starts_at','>',$now)->count();
        $thisWeekSessions = DB::table('calendar_sessions')->where(function($q) use($user){ $q->where('student_id',$user->id)->orWhere('instructor_id',$user->id); })->whereBetween('starts_at',[$now,$now->copy()->endOfWeek()])->count();
        $points = (int) DB::table('points_ledger')->where('user_id',$user->id)->sum('points');

        // ── Continue Learning ────────────────────────────────────────────────
        $continueLearning = DB::table('enrollments')
            ->join('courses','courses.id','=','enrollments.course_id')
            ->where('enrollments.user_id',$user->id)
            ->where('enrollments.status','enrolled')
            ->where('enrollments.progress','<',100)
            ->select('courses.id','courses.title','courses.category','enrollments.progress')
            ->take(3)->get()
            ->map(function($c) {
                $nextLesson = DB::table('course_lessons')
                    ->join('course_sections','course_sections.id','=','course_lessons.section_id')
                    ->where('course_sections.course_id',$c->id)
                    ->orderBy('course_sections.id')->orderBy('course_lessons.id')
                    ->value('course_lessons.title');
                $c->next_lesson = $nextLesson ?? 'Continue learning';
                return $c;
            });

        // ── Teaching Courses ─────────────────────────────────────────────────
        $teachingList = DB::table('courses')->where('teacher_id',$user->id)->select('id','title','category')->take(3)->get()
            ->map(function($c) {
                $c->students   = DB::table('enrollments')->where('course_id',$c->id)->whereIn('status',['enrolled','completed'])->count();
                $c->avg_rating = round(DB::table('reviews')->where('course_id',$c->id)->avg('rating') ?? 0, 1);
                return $c;
            });

        // ── Upcoming Sessions (simplified — no CASE WHEN join) ───────────────
        $rawSessions = DB::table('calendar_sessions as s')
            ->where(function($q) use($user){ $q->where('s.student_id',$user->id)->orWhere('s.instructor_id',$user->id); })
            ->where('s.starts_at','>',$now)
            ->orderBy('s.starts_at')
            ->take(4)
            ->select('s.id','s.title','s.starts_at','s.type','s.instructor_id','s.student_id')
            ->get();

        $sessionsList = $rawSessions->map(function($s) use($user) {
            $partnerId = ($s->instructor_id == $user->id) ? $s->student_id : $s->instructor_id;
            $partnerName = $partnerId ? DB::table('users')->where('id',$partnerId)->value('name') : 'Session';
            $dt = Carbon::parse($s->starts_at);
            $s->with_name = $partnerName ?? 'Session';
            $s->month = strtoupper($dt->format('M'));
            $s->day   = $dt->format('d');
            $s->time  = $dt->format('g:i A');
            return $s;
        });

        // ── Recent Activity ──────────────────────────────────────────────────
        $recentActivity = DB::table('user_notifications')
            ->where('user_id',$user->id)
            ->orderByDesc('created_at')
            ->take(5)->get()
            ->map(function($n) {
                $n->time_ago = Carbon::parse($n->created_at)->diffForHumans();
                $n->message  = $n->body ?? $n->title;
                return $n;
            });

        return response()->json([
            'success' => true,
            'data' => [
                'user'  => ['name'=>$user->name,'role'=>$user->role,'points'=>$points],
                'stats' => [
                    'enrolled_courses'   => $enrolledCourses,
                    'in_progress'        => $inProgress,
                    'teaching_courses'   => $teachingCourses,
                    'teaching_students'  => $teachingStudents,
                    'exchange_matches'   => $exchangeMatches,
                    'active_exchanges'   => $activeExchanges,
                    'upcoming_sessions'  => $upcomingSessions,
                    'this_week_sessions' => $thisWeekSessions,
                ],
                'continue_learning'      => $continueLearning,
                'my_teaching_courses'    => $teachingList,
                'upcoming_sessions_list' => $sessionsList,
                'recent_activity'        => $recentActivity,
            ],
        ]);
    }
}
