<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'capacity' => 'nullable|integer',
            'duration' => 'nullable|string',
            'created_date' => 'nullable|date',
            'ended_date' => 'nullable|date',
        ]);

        $course = Course::create($request->all());

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    public function index()
    {
        $courses = Course::all();

        return response()->json([
            'message' => 'Courses retrieved successfully',
            'courses' => $courses
        ]);
    }

    public function show($id)
    {
        $course = Course::findOrFail($id);

        return response()->json([
            'message' => 'Course retrieved successfully',
            'course' => $course
        ]);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'capacity' => 'nullable|integer',
            'duration' => 'nullable|string',
            'created_date' => 'nullable|date',
            'ended_date' => 'nullable|date',
        ]);

        $course->update($request->all());

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course
        ]);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    public function details($id)
    {
        $course = Course::with([
            'teacher',
            'reviews',
            'sections.lessons',
            'outcomes'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'course' => $course
        ]);
    }
}