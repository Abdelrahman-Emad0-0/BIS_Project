<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSkill;
use Illuminate\Http\Request;

class UserSkillController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'skill_ids' => 'required|array',
            'skill_ids.*' => 'exists:skills,id',
            'type' => 'required|in:teach,learn',
        ]);

        foreach ($validated['skill_ids'] as $skillId) {

            UserSkill::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'skill_id' => $skillId,
                    'type' => $validated['type'],
                ],
                []
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Skills saved successfully',
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $skills = UserSkill::with('skill')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $skills,
        ]);
    }
}