<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['user', 'course.teacher'])->latest()->get();

        return response()->json([
            'message' => 'Reports retrieved successfully',
            'reports' => $reports,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,approved,rejected',
            'date' => 'nullable|date',
        ]);

        $report = Report::create($validated);

        return response()->json([
            'message' => 'Report created successfully',
            'report' => $report,
        ], 201);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'course.teacher'])->findOrFail($id);

        return response()->json([
            'message' => 'Report retrieved successfully',
            'report' => $report,
        ]);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'course_id' => 'sometimes|exists:courses,id',
            'reason' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,approved,rejected',
            'date' => 'nullable|date',
        ]);

        $report->update($validated);

        return response()->json([
            'message' => 'Report updated successfully',
            'report' => $report,
        ]);
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }
}