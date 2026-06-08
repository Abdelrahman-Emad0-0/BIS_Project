<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'course'])->latest()->get();

        return response()->json([
            'message' => 'Reviews retrieved successfully',
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request)
    {
       
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $review = Review::create($validated);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review,
        ], 201);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['success' => true, 'message' => 'Review deleted']);
    }
}