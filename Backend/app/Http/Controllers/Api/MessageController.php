<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function inbox(Request $request)
    {
        $user = $request->user();

        $messages = Message::with(['sender', 'receiver'])
            ->where('receiver_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function sent(Request $request)
    {
        $user = $request->user();

        $messages = Message::with(['sender', 'receiver'])
            ->where('sender_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'],
            'content' => $validated['content'],
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    public function markAsRead($id)
    {
        $user = auth()->user();

        $message = Message::where('id', $id)
            ->where('receiver_id', $user->id)
            ->firstOrFail();

        $message->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read',
            'data' => $message,
        ]);
    }
}