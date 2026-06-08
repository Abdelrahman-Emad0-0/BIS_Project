<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Mock test card numbers
    private const DECLINED_CARDS = ['4000000000000002', '5100000000000051'];
    private const SUCCESS_CARDS  = ['4111111111111111', '5500000000000004'];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'required|in:card,cash',
            'service_type'   => 'required|string',
            'service_id'     => 'required|integer',
            'card_number'    => 'required_if:payment_method,card|string',
            'voucher_id'     => 'nullable|integer',
        ]);

        $isCash = $validated['payment_method'] === 'cash';
        $status = 'completed';

        if (!$isCash) {
            $rawCard = preg_replace('/\s+/', '', $request->input('card_number', ''));

            if (in_array($rawCard, self::DECLINED_CARDS)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your card was declined. Please use a different card.',
                ], 422);
            }
        } else {
            $status = 'pending';
        }

        // Apply voucher discount
        $originalAmount = (float) $validated['amount'];
        $finalAmount    = $originalAmount;
        $voucherUsed    = null;

        if (!empty($validated['voucher_id'])) {
            $redemption = RewardRedemption::where('id', $validated['voucher_id'])
                ->where('user_id', $request->user()->id)
                ->where('status', 'approved')
                ->first();

            if ($redemption) {
                $allRewards = collect(config('rewards.student_rewards'))
                    ->merge(config('rewards.instructor_rewards'));
                $reward = $allRewards->firstWhere('code', $redemption->reward_code);

                if ($reward) {
                    if ($reward['discount_type'] === 'percent') {
                        $finalAmount = $originalAmount * (1 - $reward['discount_value'] / 100);
                    } elseif ($reward['discount_type'] === 'free') {
                        $finalAmount = max(0, $originalAmount - $reward['discount_value']);
                    }
                    $finalAmount = round($finalAmount, 2);
                    $voucherUsed = $redemption;
                }
            }
        }

        $payment = Payment::create([
            'user_id'        => $request->user()->id,
            'amount'         => $finalAmount,
            'payment_method' => $validated['payment_method'],
            'currency'       => 'EGP',
            'status'         => $status,
            'service_type'   => $validated['service_type'],
            'service_id'     => $validated['service_id'],
            'date'           => now(),
        ]);

        // Mark voucher as used
        if ($voucherUsed) {
            $voucherUsed->update(['status' => 'used']);
        }

        $discount = $originalAmount - $finalAmount;
        $message  = $isCash
            ? 'Your spot is reserved. Pay EGP ' . number_format($finalAmount, 0) . ' in cash at the first session.'
            : ($discount > 0
                ? "Payment completed! You saved EGP " . number_format($discount, 2) . " with your voucher."
                : 'Payment completed successfully');

        return response()->json([
            'success' => true,
            'message' => $message,
            'payment' => $payment,
            'status'  => $status,
        ]);
    }

    public function index()
    {
        return response()->json(
            Payment::latest()->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            Payment::findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'amount'         => 'sometimes|numeric',
            'payment_method' => 'sometimes|string',
            'status'         => 'sometimes|in:pending,completed,failed,refunded',
            'currency'       => 'sometimes|string|max:10',
        ]);

        $payment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'payment' => $payment,
        ]);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully',
        ]);
    }
}