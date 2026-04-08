<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordCodeMail;
use App\Mail\NewGuestAccountNotification;
use App\Mail\TwoFactorCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|min:2',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
            ],
            'password' => ['required', 'confirmed', Password::defaults()->min(8)->max(16)],
            'faculty_id' => 'required|exists:faculty,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => 'active',
            'role_id' => $validated['role_id'],
            'faculty_id' => $validated['faculty_id'],
            'is_new_user' => true,
        ]);

        if ((int)$validated['role_id'] === 3) {
            $coordinator = User::where('faculty_id', $validated['faculty_id'])
                ->where('role_id', 5)
                ->first();

            if ($coordinator) {
                Mail::to($coordinator->email)
                    ->send(new NewGuestAccountNotification($user));
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load(['role', 'faculty']);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user, 
            'meta' => [
                'is_new_user' => true,
                'welcome_message' => 'Welcome to our platform! We\'re excited to have you here.',
            ]
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => "Your account is currently {$user->status}. Please contact support."
            ], 403);
        }

        // --- 2FA INTERCEPTOR ---
        if ($user->is_2fa_on) {
            $this->sendTwoFactorCode($user);

            return response()->json([
                'status' => '2fa_required',
                'message' => 'Verification code sent to your email.',
                'email' => $user->email
            ], 200);
        }

        // Standard Login (for 2FA off accounts)
        return $this->completeLoginProcess($request, $user);
    }

    /**
     * NEW: Verification Endpoint
     */
    public function verify2FA(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->where('verification_code', $request->code)
                    ->first();

        // Check if code matches and is within the 10-minute timer
        if (!$user || ($user->verification_expires_at && now()->isAfter($user->verification_expires_at))) {
            return response()->json([
                'message' => 'The code is invalid or has expired.'
            ], 422);
        }

        // Clear security data upon success
        $user->update([
            'verification_code' => null,
            'verification_expires_at' => null
        ]);

        return $this->completeLoginProcess($request, $user);
    }

    /**
     * NEW: Resend Endpoint
     */
    public function resend2FA(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid request.'], 422);
        }

        $this->sendTwoFactorCode($user);

        return response()->json(['message' => 'A new code has been sent.']);
    }

    /**
     * HELPER: Logic for sending the code and setting the timer
     */
    protected function sendTwoFactorCode(User $user): void
    {
        $code = (string) rand(100000, 999999);
        $user->update([
            'verification_code' => $code,
            'verification_expires_at' => now()->addMinutes(10) // 10-minute timer
        ]);

        Mail::to($user->email)->send(new TwoFactorCodeMail($code));
    }

    /**
     * HELPER: Your Original Group Success Logic (Browser, Welcome, Token)
     */
    protected function completeLoginProcess(Request $request, User $user): JsonResponse
    {
        $wasNewUser = $user->is_new_user;
        $lastLogin = $user->last_login_formatted;

        // --- Original Browser Logic ---
        $agent = $request->header('User-Agent');
        $browser = 'Other';
        if (str_contains($agent, 'Chrome')) $browser = 'Chrome';
        elseif (str_contains($agent, 'Firefox')) $browser = 'Firefox';
        elseif (str_contains($agent, 'Safari')) $browser = 'Safari';
        elseif (str_contains($agent, 'Edge')) $browser = 'Edge';

        $user->update(['browser' => $browser]);
        $user->trackLogin();

        // --- Original Token & Response Logic ---
        $token = $user->createToken('auth_token')->plainTextToken;
        $user->load(['role', 'faculty']);

        $response = [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];

        $response['meta'] = $wasNewUser
        ? ['is_first_login' => true, 'welcome_message' => '...']
        : ['is_first_login' => false, 'last_login' => $lastLogin]; 

        return response()->json($response, 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'faculty']);

        return response()->json([
            'user' => $user,
            'meta' => [
                'is_new_user' => $user->is_new_user,
                'last_login' => $user->last_login_formatted,
            ]
        ], 200);
    }

    /**
     * FORGOT PASSWORD: Step 1 - Send Code
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|exists:users,email']);

        $user = User::where('email', $request->email)->first();

        if ($user->status !== 'active') {
            return response()->json([
                'message' => "Your account is currently inactive. Please contact support."
            ], 403);
        }

        // Reuse the same timer logic
        $code = (string) rand(100000, 999999);
        $user->update([
            'verification_code' => $code,
            'verification_expires_at' => now()->addMinutes(10)
        ]);

        // You'll need to create this Mailable (see below)
        Mail::to($user->email)->send(new ForgotPasswordCodeMail($code));

        return response()->json([
            'email' => $user->email,
            'message' => 'Password reset code sent to your email.'
        ]);
    }

    /**
     * FORGOT PASSWORD: Step 2 - Verify Code
     * (Checks if code is correct and not expired before showing reset form)
     */
    public function verifyPasswordCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->where('verification_code', $request->code)
                    ->first();

        if (!$user || ($user->verification_expires_at && now()->isAfter($user->verification_expires_at))) {
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        return response()->json(['message' => 'Code verified. You may now reset your password.']);
    }

    /**
     * FORGOT PASSWORD: Step 3 - Reset Password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'password' => ['required', 'confirmed', Password::defaults()->min(8)->max(16)],
        ]);

        $user = User::where('email', $request->email)
                    ->where('verification_code', $request->code)
                    ->first();
                    

        if (!$user || ($user->verification_expires_at && now()->isAfter($user->verification_expires_at))) {
            return response()->json(['message' => 'Session expired. Please request a new code.'], 422);
        }

        // Update password and clear code
        $user->update([
            'password' => Hash::make($request->password),
            'verification_code' => null,
            'verification_expires_at' => null
        ]);

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
}