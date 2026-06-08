<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use App\Models\TeacherVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Course;
use App\Models\Review;
use App\Models\Payment;
use App\Models\Enrollment;

class TeacherController extends Controller
{
    public function accountInfo(Request $request)
    {
        try {
            $user = $request->user();

            // ── New teacher registration (no token yet) ───────────────────────
            if (!$user) {
                $validated = $request->validate([
                    'name'                  => 'required|string|max:255',
                    'email'                 => 'required|email|unique:users,email',
                    'phone'                 => 'required|string|unique:users,phone',
                    'password'              => 'required|string|min:8|confirmed',
                    'gender'                => 'required|in:male,female',
                ]);

                $user = \App\Models\User::create([
                    'name'     => $validated['name'],
                    'email'    => $validated['email'],
                    'phone'    => $validated['phone'],
                    'password' => Hash::make($validated['password']),
                    'gender'   => $validated['gender'],
                    'role'     => 'teacher',
                ]);

                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'message' => 'Teacher account created successfully',
                    'token'   => $token,
                    'data'    => $user,
                ], 201);
            }

            // ── Existing teacher updating their info (has token) ──────────────
            $validated = $request->validate([
                'name'     => 'sometimes|string|max:255',
                'email'    => 'sometimes|email|unique:users,email,' . $user->id,
                'phone'    => 'sometimes|string|unique:users,phone,' . $user->id,
                'password' => 'sometimes|string|min:8|confirmed',
                'gender'   => 'sometimes|in:male,female',
            ]);

            if (isset($validated['name']))     $user->name     = $validated['name'];
            if (isset($validated['email']))    $user->email    = $validated['email'];
            if (isset($validated['phone']))    $user->phone    = $validated['phone'];
            if (isset($validated['gender']))   $user->gender   = $validated['gender'];
            if (isset($validated['password'])) $user->password = Hash::make($validated['password']);

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Teacher account info updated successfully',
                'data'    => $user,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher account info failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function verification(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $validated = $request->validate([
                'id_document' => 'nullable|string',
                'certificates' => 'nullable|string',
                'payment_method' => 'nullable|string',
                'iban' => 'nullable|string',
            ]);

            $verification = TeacherVerification::updateOrCreate(
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
                'message' => 'Teacher verification data saved successfully',
                'data' => $verification,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher verification failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function bio(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $validated = $request->validate([
                'bio' => 'nullable|string',
                'experience' => 'nullable|string',
                'qualifications' => 'nullable|string',
            ]);

            $profile = TeacherProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'bio' => $validated['bio'] ?? null,
                    'experience' => $validated['experience'] ?? null,
                    'qualifications' => $validated['qualifications'] ?? null,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Teacher bio saved successfully',
                'data' => $profile,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Teacher bio failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function overview(Request $request)
{
    $user = $request->user();

    $totalCourses = Course::where('teacher_id', $user->id)->count();

    $courseIds = Course::where('teacher_id', $user->id)->pluck('id');

    $totalStudents = Enrollment::whereIn('course_id', $courseIds)
        ->distinct('user_id')
        ->count('user_id');

    $averageRating = Review::whereIn('course_id', $courseIds)
        ->avg('rating') ?? 0;

    $totalEarnings = Payment::whereIn('service_id', $courseIds)
        ->where('service_type', 'course')
        ->where('status', 'completed')
        ->sum('amount');

    return response()->json([
        'success' => true,
        'data' => [
            'total_courses' => $totalCourses,
            'total_students' => $totalStudents,
            'average_rating' => round($averageRating, 1),
            'total_earnings' => $totalEarnings,
        ]
    ]);
}
}