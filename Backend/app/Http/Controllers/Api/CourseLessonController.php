<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseLesson;
use App\Models\CourseSection;
use Illuminate\Http\Request;

class CourseLessonController extends Controller
{
    public function store(Request $request, $sectionId)
    {
        $request->validate([
            'title' => 'required',
            'type' => 'required',
            'duration' => 'nullable',
            'content_url' => 'nullable',
        ]);

        $section = CourseSection::findOrFail($sectionId);

        $lesson = CourseLesson::create([
            'section_id' => $section->id,
            'title' => $request->title,
            'type' => $request->type,
            'duration' => $request->duration,
            'content_url' => $request->content_url,
        ]);

        return response()->json([
            'success' => true,
            'lesson' => $lesson
        ]);
    }
}