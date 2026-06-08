<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PointLedger;
use App\Models\RewardRedemption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RewardsController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $totalPoints = (int) DB::table('points_ledger')->where('user_id', $user->id)->sum('points');
        $weeklyPoints = (int) DB::table('points_ledger')
            ->where('user_id', $user->id)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('points');

        $currentLevel = $this->resolveLevel($totalPoints);
        $nextReward = $this->nextReward($totalPoints);

        return response()->json([
            'success' => true,
            'data' => [
                'total_points' => $totalPoints,
                'weekly_points' => $weeklyPoints,
                'current_level' => $currentLevel,
                'points_to_next_reward' => $nextReward ? max(0, $nextReward['next'] - $totalPoints) : 0,
                'next_reward' => $nextReward ? [
                    'title'  => $nextReward['next_level_name'],
                    'points' => $nextReward['next'],
                ] : null,
                'how_you_earn' => config('rewards.how_you_earn'),
                'student_rewards' => config('rewards.student_rewards'),
                'instructor_rewards' => config('rewards.instructor_rewards'),
                'redemptions' => RewardRedemption::query()
                    ->where('user_id', $user->id)
                    ->latest()
                    ->limit(10)
                    ->get(),
            ],
        ]);
    }

    public function redeem(Request $request): JsonResponse
    {
        $user = auth()->user();

        $data = $request->validate([
            'reward_code' => ['required', 'string'],
        ]);

        $reward = collect(config('rewards.student_rewards'))
            ->merge(config('rewards.instructor_rewards'))
            ->firstWhere('code', $data['reward_code']);

        if (! $reward) {
            throw ValidationException::withMessages([
                'reward_code' => 'Reward code not found.',
            ]);
        }

        $totalPoints = (int) DB::table('points_ledger')->where('user_id', $user->id)->sum('points');
        if ($totalPoints < $reward['points']) {
            throw ValidationException::withMessages([
                'reward_code' => 'Not enough points to redeem this reward.',
            ]);
        }

        RewardRedemption::create([
            'user_id' => $user->id,
            'reward_code' => $reward['code'],
            'title' => $reward['title'],
            'points' => $reward['points'],
            'status' => 'approved',
            'metadata' => [
                'description' => $reward['description'] ?? null,
            ],
            'redeemed_at' => now(),
        ]);

        PointLedger::create([
            'user_id' => $user->id,
            'source_type' => 'reward_redemption',
            'source_id' => null,
            'points' => -1 * (int) $reward['points'],
            'description' => 'Redeemed reward: ' . $reward['title'],
            'metadata' => [
                'reward_code' => $reward['code'],
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reward redeemed successfully.',
            'data' => [
                'reward' => $reward,
            ],
        ]);
    }

    public function activeVoucher(Request $request): JsonResponse
    {
        $user = $request->user();

        $redemption = RewardRedemption::where('user_id', $user->id)
            ->where('status', 'approved')
            ->latest()
            ->first();

        if (!$redemption) {
            return response()->json(['success' => true, 'voucher' => null]);
        }

        // Find discount details from config
        $allRewards = collect(config('rewards.student_rewards'))
            ->merge(config('rewards.instructor_rewards'));

        $reward = $allRewards->firstWhere('code', $redemption->reward_code);

        return response()->json([
            'success' => true,
            'voucher' => [
                'id'             => $redemption->id,
                'code'           => $redemption->reward_code,
                'title'          => $redemption->title,
                'discount_type'  => $reward['discount_type'] ?? null,
                'discount_value' => $reward['discount_value'] ?? 0,
            ],
        ]);
    }

    private function resolveLevel(int $points): array
    {
        $thresholds = config('rewards.level_thresholds', []);
        $current = ['name' => 'Beginner', 'badge' => 'bronze', 'next' => null];

        foreach ($thresholds as $threshold => $level) {
            if ($points >= (int) $threshold) {
                $current = $level;
            }
        }

        return $current;
    }

    private function nextReward(int $points): ?array
    {
        $thresholds = config('rewards.level_thresholds', []);
        $sorted = collect($thresholds)->sortKeys()->values();

        foreach ($sorted as $level) {
            if (! isset($level['next']) || $level['next'] === null) {
                continue;
            }

            if ($points < $level['next']) {
                return $level;
            }
        }

        return null;
    }
}
