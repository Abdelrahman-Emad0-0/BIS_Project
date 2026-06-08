<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CalendarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $view = $request->get('view', 'month');
        $date = Carbon::parse($request->get('date', now()));

        $start = match ($view) {
            'week' => $date->copy()->startOfWeek(),
            'day'  => $date->copy()->startOfDay(),
            default => $date->copy()->startOfMonth(),
        };

        $end = match ($view) {
            'week' => $date->copy()->endOfWeek(),
            'day'  => $date->copy()->endOfDay(),
            default => $date->copy()->endOfMonth(),
        };

        $events = DB::table('calendar_events')
            ->where('user_id', $user->id)
            ->whereBetween('starts_at', [$start, $end])
            ->orderBy('starts_at')
            ->get()
            ->map(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'subtitle' => $event->subtitle,
                'type' => $event->type,
                'starts_at' => $event->starts_at,
                'ends_at' => $event->ends_at,
                'color' => $event->color ?? 'violet',
                'status' => $event->status ?? 'scheduled',
            ]);

        $sessions = DB::table('calendar_sessions as s')
            ->leftJoin('users as u', 'u.id', '=', 's.partner_id')
            ->where(function ($q) use ($user) {
                $q->where('s.instructor_id', $user->id)
                  ->orWhere('s.student_id', $user->id);
            })
            ->whereBetween('s.starts_at', [$start, $end])
            ->select([
                's.id',
                's.title',
                's.type',
                's.starts_at',
                's.ends_at',
                's.status',
                DB::raw("COALESCE(u.name, 'Session') as partner_name"),
            ])
            ->orderBy('s.starts_at')
            ->get()
            ->map(fn ($session) => [
                'id' => 'session-' . $session->id,
                'title' => $session->title ?? ucfirst($session->type) . ' Session',
                'subtitle' => $session->partner_name,
                'type' => 'session',
                'starts_at' => $session->starts_at,
                'ends_at' => $session->ends_at,
                'color' => 'purple',
                'status' => $session->status,
            ]);

        $upcomingSessions = DB::table('calendar_sessions as s')
            ->leftJoin('users as u', 'u.id', '=', 's.partner_id')
            ->where(function ($q) use ($user) {
                $q->where('s.instructor_id', $user->id)
                  ->orWhere('s.student_id', $user->id);
            })
            ->where('s.starts_at', '>=', now())
            ->whereIn('s.status', ['scheduled', 'confirmed'])
            ->orderBy('s.starts_at')
            ->limit(4)
            ->select([
                's.id',
                's.title',
                's.starts_at',
                's.type',
                DB::raw("COALESCE(u.name, 'Session') as partner_name"),
            ])
            ->get();

        $miniCalendar = DB::table('calendar_events')
            ->where('user_id', $user->id)
            ->whereMonth('starts_at', $date->month)
            ->whereYear('starts_at', $date->year)
            ->select('starts_at')
            ->get()
            ->groupBy(fn($e) => Carbon::parse($e->starts_at)->day)
            ->map(fn($group) => $group->count());

        return response()->json([
            'success' => true,
            'data' => [
                'current_month' => $date->format('F Y'),
                'view' => $view,
                'range' => [
                    'start' => $start->toDateTimeString(),
                    'end' => $end->toDateTimeString(),
                ],
                'events' => $events->values(),
                'sessions' => $sessions->values(),
                'upcoming_sessions' => $upcomingSessions,
                'mini_calendar' => $miniCalendar,
                'filters' => [
                    'sessions' => DB::table('calendar_sessions')->where(function ($q) use ($user) {
                        $q->where('instructor_id', $user->id)->orWhere('student_id', $user->id);
                    })->count(),
                    'courses' => DB::table('calendar_events')->where('user_id', $user->id)->where('type', 'course')->count(),
                    'meetings' => DB::table('calendar_events')->where('user_id', $user->id)->where('type', 'meeting')->count(),
                    'deadlines' => DB::table('calendar_events')->where('user_id', $user->id)->where('type', 'deadline')->count(),
                    'reminders' => DB::table('calendar_events')->where('user_id', $user->id)->where('type', 'reminder')->count(),
                    'events' => DB::table('calendar_events')->where('user_id', $user->id)->where('type', 'event')->count(),
                ],
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:session,course,meeting,deadline,reminder,event'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'notes' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $id = DB::table('calendar_events')->insertGetId([
            'user_id' => $user->id,
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'type' => $data['type'],
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'] ?? null,
            'notes' => $data['notes'] ?? null,
            'color' => $data['color'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully.',
            'data' => ['id' => $id],
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', 'in:session,course,meeting,deadline,reminder,event'],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:50'],
        ]);

        $event = DB::table('calendar_events')->where('id', $id)->where('user_id', $user->id)->first();
        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found.'], 404);
        }

        DB::table('calendar_events')->where('id', $id)->where('user_id', $user->id)->update(array_merge($data, [
            'updated_at' => now(),
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully.',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();

        DB::table('calendar_events')->where('id', $id)->where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully.',
        ]);
    }
    public function storeSession(Request $request): JsonResponse
{
    $user = auth()->user();

    $data = $request->validate([
        'instructor_id' => ['required', 'exists:users,id'],
        'student_id' => ['required', 'exists:users,id'],
        'partner_id' => ['nullable', 'exists:users,id'],
        'title' => ['nullable', 'string', 'max:255'],
        'type' => ['nullable', 'string', 'max:255'],
        'starts_at' => ['required', 'date'],
        'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        'status' => ['nullable', 'in:scheduled,confirmed,completed,cancelled'],
    ]);

    $id = DB::table('calendar_sessions')->insertGetId([
        'instructor_id' => $data['instructor_id'],
        'student_id' => $data['student_id'],  
        'partner_id' => $data['partner_id'] ?? null,
        'title' => $data['title'] ?? null,
        'type' => $data['type'] ?? 'session',
        'starts_at' => $data['starts_at'],
        'ends_at' => $data['ends_at'] ?? null,
        'status' => $data['status'] ?? 'scheduled',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Session created successfully.',
        'data' => ['id' => $id],
    ], 201);
}
}
