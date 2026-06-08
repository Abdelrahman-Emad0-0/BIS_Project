<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Verification;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'id_document' => 'nullable|string',
            'certificates' => 'nullable|string',
            'payment_method' => 'nullable|string|max:255',
            'iban' => 'nullable|string|max:255',
        ]);

        $verification = Verification::updateOrCreate(
            ['user_id' => $user->id],
            [
                'id_document' => $validated['id_document'] ?? null,
                'certificates' => $validated['certificates'] ?? null,
                'payment_method' => $validated['payment_method'] ?? null,
                'iban' => $validated['iban'] ?? null,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Verification saved successfully',
            'data' => $verification,
        ], 201);
    }

    public function show(Request $request)
    {
        $verification = Verification::where('user_id', $request->user()->id)->first();

        return response()->json([
            'success' => true,
            'data' => $verification,
        ]);
    }
}