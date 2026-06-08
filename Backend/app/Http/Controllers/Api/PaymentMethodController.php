<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'method' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:255',
        ]);

        $paymentMethod = PaymentMethod::updateOrCreate(
            ['user_id' => $user->id],
            [
                'method' => $validated['method'],
                'account_number' => $validated['account_number'] ?? null,
                'iban' => $validated['iban'] ?? null,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Payment method saved successfully',
            'data' => $paymentMethod,
        ], 201);
    }

    public function show(Request $request)
    {
        $paymentMethod = PaymentMethod::where(
            'user_id',
            $request->user()->id
        )->first();

        return response()->json([
            'success' => true,
            'data' => $paymentMethod,
        ]);
    }
}