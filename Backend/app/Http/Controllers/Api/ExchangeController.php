<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exchange;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Http\Request;

class ExchangeController extends Controller
{
    public function matches(Request $request)
    {
        $user = $request->user();

        $myTeachSkillIds = UserSkill::where('user_id', $user->id)
            ->where('type', 'teach')
            ->pluck('skill_id');

        $myLearnSkillIds = UserSkill::where('user_id', $user->id)
            ->where('type', 'learn')
            ->pluck('skill_id');

        $matches = User::where('id', '!=', $user->id)
            ->whereHas('teachSkills', function ($query) use ($myLearnSkillIds) {
                $query->whereIn('skills.id', $myLearnSkillIds);
            })
            ->whereHas('learnSkills', function ($query) use ($myTeachSkillIds) {
                $query->whereIn('skills.id', $myTeachSkillIds);
            })
            ->with(['teachSkills', 'learnSkills'])
            ->get()
            ->map(function ($matchedUser) use ($myTeachSkillIds, $myLearnSkillIds) {
                $theyTeach = $matchedUser->teachSkills->whereIn('id', $myLearnSkillIds)->values();
                $theyLearn = $matchedUser->learnSkills->whereIn('id', $myTeachSkillIds)->values();

                return [
                    'user' => [
                        'id' => $matchedUser->id,
                        'name' => $matchedUser->name,
                        'email' => $matchedUser->email,
                        'role' => $matchedUser->role,
                    ],
                    'they_teach' => $theyTeach,
                    'they_learn' => $theyLearn,
                    'score' => $theyTeach->count() + $theyLearn->count(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $matches,
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $base = Exchange::with(['requester', 'partner', 'requesterSkill', 'partnerSkill'])
            ->where(function ($q) use ($user) {
                $q->where('requester_id', $user->id)->orWhere('partner_id', $user->id);
            })->latest();

        $incoming = (clone $base)->where('partner_id', $user->id)->where('status', 'pending')->get();
        $outgoing = (clone $base)->where('requester_id', $user->id)->where('status', 'pending')->get();
        $matched  = (clone $base)->where('status', 'accepted')->get();
        $all      = $base->get();

        return response()->json([
            'success'  => true,
            'data'     => $all,
            'incoming' => $incoming,
            'outgoing' => $outgoing,
            'matched'  => $matched,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'partner_id' => 'required|exists:users,id',
            'requester_skill_id' => 'required|exists:skills,id',
            'partner_skill_id' => 'required|exists:skills,id',
            'message' => 'nullable|string|max:1000',
        ]);

        if ($validated['partner_id'] == $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot exchange with yourself.',
            ], 422);
        }

        $ownsRequesterSkill = UserSkill::where('user_id', $user->id)
            ->where('skill_id', $validated['requester_skill_id'])
            ->where('type', 'teach')
            ->exists();

        if (!$ownsRequesterSkill) {
            return response()->json([
                'success' => false,
                'message' => 'You do not own the skill you want to offer.',
            ], 422);
        }

        $partnerOwnsSkill = UserSkill::where('user_id', $validated['partner_id'])
            ->where('skill_id', $validated['partner_skill_id'])
            ->where('type', 'teach')
            ->exists();

        if (!$partnerOwnsSkill) {
            return response()->json([
                'success' => false,
                'message' => 'The partner does not teach the requested skill.',
            ], 422);
        }

        $exchange = Exchange::create([
            'requester_id' => $user->id,
            'partner_id' => $validated['partner_id'],
            'requester_skill_id' => $validated['requester_skill_id'],
            'partner_skill_id' => $validated['partner_skill_id'],
            'status' => 'pending',
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Exchange request sent successfully',
            'data' => $exchange,
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected,completed',
        ]);

        $exchange = Exchange::where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('requester_id', $user->id)
                      ->orWhere('partner_id', $user->id);
            })
            ->firstOrFail();

        $isPartner    = $exchange->partner_id === $user->id;
        $isRequester  = $exchange->requester_id === $user->id;
        $newStatus    = $validated['status'];

        // Only the partner can accept or reject a request.
        // Either party can mark an accepted exchange as completed.
        if (in_array($newStatus, ['accepted', 'rejected']) && ! $isPartner) {
            return response()->json([
                'success' => false,
                'message' => 'Only the partner can accept or reject an exchange request.',
            ], 403);
        }

        if ($newStatus === 'completed' && ! ($isPartner || $isRequester)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 403);
        }

        $exchange->update([
            'status' => $newStatus,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Exchange status updated successfully',
            'data' => $exchange,
        ]);
    }
    public function popularSkills()
    {
        $skills = \Illuminate\Support\Facades\DB::table('user_skills')
            ->join('skills', 'skills.id', '=', 'user_skills.skill_id')
            ->select('skills.id', 'skills.name', \Illuminate\Support\Facades\DB::raw('COUNT(*) as total'))
            ->groupBy('skills.id', 'skills.name')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        return response()->json(['success' => true, 'data' => $skills]);
    }

    public function overview(Request $request)
{
    $user = $request->user();

    $totalMatches = \App\Models\Exchange::where(function ($q) use ($user) {
        $q->where('requester_id', $user->id)
          ->orWhere('partner_id', $user->id);
    })
    ->where('status', 'accepted')
    ->count();

    $pendingRequests = \App\Models\Exchange::where(function ($q) use ($user) {
        $q->where('requester_id', $user->id)
          ->orWhere('partner_id', $user->id);
    })
    ->where('status', 'pending')
    ->count();

    $skillsCanTeach = \App\Models\UserSkill::where('user_id', $user->id)
        ->where('type', 'teach')
        ->count();

    $skillsWantLearn = \App\Models\UserSkill::where('user_id', $user->id)
        ->where('type', 'learn')
        ->count();

    return response()->json([
        'success' => true,
        'data' => [
            'total_matches' => $totalMatches,
            'pending_requests' => $pendingRequests,
            'skills_can_teach' => $skillsCanTeach,
            'skills_want_to_learn' => $skillsWantLearn,
        ]
    ]);
}
}