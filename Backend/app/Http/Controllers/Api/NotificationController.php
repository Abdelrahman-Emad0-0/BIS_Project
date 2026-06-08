<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = UserNotification::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'body' => 'nullable|string',
        ]);

        $notification = UserNotification::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'body' => $validated['body'] ?? null,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notification created successfully',
            'data' => $notification,
        ], 201);
    }

    public function markAsRead($id)
    {
        $user = auth()->user();

        $notification = UserNotification::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'data' => $notification,
        ]);
    }


    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $updated = UserNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'data' => ['updated_count' => $updated],
        ]);
    }

    // Admin: view all notifications across all users
    public function adminIndex()
    {
        $notifications = UserNotification::with('user:id,name,email')
            ->latest()
            ->paginate(30);

        $stats = [
            'total'  => UserNotification::count(),
            'unread' => UserNotification::where('is_read', false)->count(),
        ];

        return response()->json(['success' => true, 'data' => $notifications, 'stats' => $stats]);
    }

    // Admin: send to specific user or all users
    public function adminSend(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'body'    => 'nullable|string',
            'user_id' => 'nullable|exists:users,id', // null = broadcast to all
        ]);

        if ($validated['user_id']) {
            UserNotification::create([
                'user_id'  => $validated['user_id'],
                'title'    => $validated['title'],
                'body'     => $validated['body'] ?? null,
                'is_read'  => false,
            ]);
            $sent = 1;
        } else {
            // Broadcast to all non-admin users
            $users = \App\Models\User::where('role', '!=', 'admin')->pluck('id');
            foreach ($users as $uid) {
                UserNotification::create([
                    'user_id' => $uid,
                    'title'   => $validated['title'],
                    'body'    => $validated['body'] ?? null,
                    'is_read' => false,
                ]);
            }
            $sent = $users->count();
        }

        return response()->json(['success' => true, 'message' => "Notification sent to {$sent} user(s)."]);
    }

}
