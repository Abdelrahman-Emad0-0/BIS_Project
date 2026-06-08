<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseOutcome;
use Illuminate\Http\Request;

class CourseOutcomeController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $request->validate([
            'outcome' => 'required|string'
        ]);

        $course = Course::findOrFail($courseId);

        $outcome = CourseOutcome::create([
            'course_id' => $course->id,
            'outcome' => $request->outcome,
        ]);

        return response()->json([
            'success' => true,
            'outcome' => $outcome
        ]);
    }
}