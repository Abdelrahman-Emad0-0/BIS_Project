<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\UserSkillController;
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ExchangeController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\RewardsController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\TeachController;
use App\Http\Controllers\Api\ExploreCoursesController;
use App\Models\CourseSection;
use App\Models\CourseOutcome;
use App\Http\Controllers\Api\CourseSectionController;
use App\Http\Controllers\Api\CourseLessonController;
use App\Http\Controllers\Api\CourseOutcomeController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/teacher/account-info', [TeacherController::class, 'accountInfo']);

Route::get('/ping', function () {
    return response()->json(['ok' => true]);
});

// TEST ONLY — add points to logged-in user (remove before production)
Route::post('/test/add-points', function (\Illuminate\Http\Request $req) {
    $user = $req->user();
    if (!$user) return response()->json(['error' => 'Unauthenticated'], 401);
    $pts = (int) $req->input('points', 500);
    \App\Models\PointLedger::create([
        'user_id'     => $user->id,
        'source_type' => 'test',
        'source_id'   => 0,
        'points'      => $pts,
        'description' => "Test points added (+{$pts})",
    ]);
    $total = \Illuminate\Support\Facades\DB::table('points_ledger')->where('user_id', $user->id)->sum('points');
    return response()->json(['success' => true, 'added' => $pts, 'total' => $total]);
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/analytics', [AnalyticsController::class, 'index']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/courses', [CourseController::class, 'index']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    Route::put('/payments/{id}', [PaymentController::class, 'update']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::put('/reports/{id}', [ReportController::class, 'update']);
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

    Route::post('/skills', [SkillController::class, 'store']);

    // Admin notifications — view all + broadcast
    Route::get('/admin/notifications', [NotificationController::class, 'adminIndex']);
    Route::post('/admin/notifications/send', [NotificationController::class, 'adminSend']);

    // Admin delete review
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/search', [SearchController::class, 'index']);

    Route::post('/enrollments/enroll', [EnrollmentController::class, 'enroll']);
    Route::post('/enrollments/completed', [EnrollmentController::class, 'completed']);
    Route::post('/enrollments/wishlist', [EnrollmentController::class, 'wishlist']);

    Route::post('/my-courses/enrolled', [EnrollmentController::class, 'enrolledCourses']);
    Route::post('/my-courses/completed', [EnrollmentController::class, 'completedCourses']);
    Route::post('/my-courses/wishlist', [EnrollmentController::class, 'wishlistCourses']);
    Route::post('/my-courses/teaching', [EnrollmentController::class, 'teachingCourses']);
    Route::post('/my-courses/search', [EnrollmentController::class, 'searchMyCourses']);
    Route::get('/my-courses/continue-learning', [EnrollmentController::class, 'continueLearning']);

    Route::post('/teacher/bio', [TeacherController::class, 'bio']);

    Route::get('/my-skills', [UserSkillController::class, 'index']);
    Route::post('/my-skills', [UserSkillController::class, 'store']);

    Route::post('/verification', [VerificationController::class, 'store']);
    Route::get('/verification', [VerificationController::class, 'show']);

    Route::post('/payment-method', [PaymentMethodController::class, 'store']);
    Route::get('/payment-method', [PaymentMethodController::class, 'show']);

    Route::post('/payments', [PaymentController::class, 'store']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/settings', [SettingsController::class, 'show']);
    Route::put('/settings', [SettingsController::class, 'update']);

    Route::get('/messages/inbox', [MessageController::class, 'inbox']);
    Route::get('/messages/sent', [MessageController::class, 'sent']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/exchange/matches', [ExchangeController::class, 'matches']);
    Route::get('/exchange', [ExchangeController::class, 'index']);
    Route::post('/exchange', [ExchangeController::class, 'store']);
    Route::put('/exchange/{id}/status', [ExchangeController::class, 'updateStatus']);
    Route::get('/exchange/overview', [ExchangeController::class, 'overview']);
    Route::get('/exchange/popular-skills', [ExchangeController::class, 'popularSkills']);

    Route::get('/profile/stats', [ProfileController::class, 'stats']);
    Route::get('/profile/achievements', [ProfileController::class, 'achievements']);
    Route::get('/profile/reviews', [ProfileController::class, 'reviews']);

    Route::get('/teacher/overview', [TeacherController::class, 'overview']);

    Route::get('/calendar', [CalendarController::class, 'index']);
Route::post('/calendar/events', [CalendarController::class, 'store']);
Route::put('/calendar/events/{id}', [CalendarController::class, 'update']);
Route::delete('/calendar/events/{id}', [CalendarController::class, 'destroy']);

Route::get('/rewards', [RewardsController::class, 'index']);
Route::post('/rewards/redeem', [RewardsController::class, 'redeem']);
Route::get('/rewards/active-voucher', [RewardsController::class, 'activeVoucher']);

Route::post('/calendar/sessions', [CalendarController::class, 'storeSession']);

Route::get('/user/dashboard', [UserDashboardController::class, 'index']);

Route::get('/teacher/dashboard', [TeachController::class, 'index']);

Route::get('/explore/courses', [ExploreCoursesController::class, 'index']);
Route::get('/explore/categories', [ExploreCoursesController::class, 'categories']);

Route::get('/teach/overview', [TeachController::class, 'index']);

Route::post('/courses/{id}/sections', [CourseSectionController::class, 'store']);

Route::post('/sections/{id}/lessons', [CourseLessonController::class, 'store']);

Route::post('/courses/{id}/outcomes', [CourseOutcomeController::class, 'store']);

});
Route::get('/courses/{id}/details', [CourseController::class, 'details']);

