<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\GuestReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PageViewController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::get('/test-cors', function () {
    return response()->json([
        'success' => true,
        'message' => 'CORS is working!',
        'allowed_origin' => 'http://localhost:3000',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// 2fa
Route::post('/login/verify', [AuthController::class, 'verify2FA']);
Route::post('/login/resend', [AuthController::class, 'resend2FA']);
// forgot password
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/forgot-password/verify', [AuthController::class, 'verifyPasswordCode']);
Route::post('/forgot-password/reset', [AuthController::class, 'resetPassword']);

// routes/api.php
Route::post('/chatbot/message', [ChatbotController::class, 'chat']);

// Faculties (Read-Only)
Route::get('/faculties', [FacultyController::class, 'index']);
// Faculties (Read-Only)
Route::get('/roles', [RoleController::class, 'index']);
// Categories (Read-Only)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('academic-years/active', [AcademicYearController::class, 'getActiveList']);

//Contact Us
Route::post('/contact', [ContactController::class, 'store']);           // Send message

Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard routes
    Route::get('/coordinator/dashboard', [ContributionController::class, 'CoordinatorDashboard']);
    Route::get('/manager/dashboard', [ContributionController::class, 'managerDashboard']);
    Route::get('/student/dashboard', [ContributionController::class, 'studentDashboard']);

    // User routes
    Route::apiResource('users', UserController::class)->except(['destroy']);
    Route::patch('users/{user}/status', [UserController::class, 'updateStatus']);
    Route::patch('users/{user}/password', [UserController::class, 'updatePassword']);
    Route::post('users/{id}/profile', [UserController::class, 'updateProfile']);
    Route::get('faculty/students', [UserController::class, 'getFacultyStudents']);
    Route::get('faculty/guests', [UserController::class, 'getFacultyGuests']);

    Route::post('/user/toggle-2fa', [UserController::class, 'toggleTwoFactor']);
    Route::post('/user/complete-tour', [UserController::class, 'completeTour']);

    // Academic Year routes
    Route::apiResource('academic-years', AcademicYearController::class)->except(['destroy']);
    Route::patch('academic-years/{academicYear}/status', [AcademicYearController::class, 'updateStatus']);

    // Contribution routes
    Route::patch('contributions/select', [ContributionController::class, 'selectContributions']);
    Route::post('contributions', [ContributionController::class, 'store']);
    Route::apiResource('contributions', ContributionController::class)->except(['destroy']);
    Route::get('contributions/{contribution}/download', [ContributionController::class, 'downloadFile']);
    Route::get('contributions/{contribution}/download-cover', [ContributionController::class, 'downloadCover']);
    Route::post('/contributions/sync-reject', [ContributionController::class, 'syncAutoReject']);
    Route::get('/contributions/selected/student', [ContributionController::class, 'selectedContriubtionsForStudent']);

    // Fetch and Create comments for a specific contribution
    Route::get('contributions/{contribution}/comments', [CommentController::class, 'index']);
    Route::post('contributions/{contribution}/comments', [CommentController::class, 'store']);

    // Update or Delete specific comments
    Route::apiResource('comments', CommentController::class)->only(['update', 'destroy']);

    // ========== NOTIFICATION ROUTES ==========
    // Get unread count
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);

    // Mark all as read
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Mark single notification as read
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Bulk delete notifications
    Route::delete('/notifications/bulk-delete', [NotificationController::class, 'bulkDestroy']);

    // Standard CRUD routes for notifications
    Route::apiResource('notifications', NotificationController::class);

    // Admin Report
    Route::get('/admin/report', [AdminReportController::class, 'report']);

    // Zip file download
    Route::get('/contributions/faculty/{facultyId}/download-zip', [ContributionController::class, 'downloadFacultyZip']);

    // Guest Dashboard
    Route::get('guest/dashboard', [GuestReportController::class, 'dashboard']);

    // Contact Us
    Route::get('/contacts', [ContactController::class, 'index']);           // View messages
    Route::put('/contacts/{id}/read', [ContactController::class, 'markAsRead']); // Mark as read

    
});

    // Page View
    Route::post('/track-view', [PageViewController::class, 'track']);