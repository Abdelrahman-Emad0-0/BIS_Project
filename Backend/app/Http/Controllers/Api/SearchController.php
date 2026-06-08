<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = trim($validated['q']);
        $limit = $validated['limit'] ?? 10;

        $courses = Course::query()
            ->with('teacher:id,name,role')
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('category', 'like', "%{$query}%");
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(function ($course) {
                return [
                    'type' => 'course',
                    'id' => $course->id,
                    'title' => $course->title,
                    'subtitle' => $course->category ?? $course->teacher?->name,
                    'teacher' => $course->teacher?->name,
                    'price' => $course->price,
                ];
            });

        $teachers = User::query()
            ->where('role', 'teacher')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'teacher',
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ];
            });

        $skills = Skill::query()
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->limit($limit)
            ->get()
            ->map(function ($skill) {
                return [
                    'type' => 'skill',
                    'id' => $skill->id,
                    'name' => $skill->name,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'query' => $query,
                'courses' => $courses->values(),
                'teachers' => $teachers->values(),
                'skills' => $skills->values(),
                'total_results' => $courses->count() + $teachers->count() + $skills->count(),
            ],
        ]);
    }
}
