<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Retrieve a paginated list of users with their assigned roles and faculties.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $users = User::with(['role', 'faculty'])
            ->paginate($request->integer('per_page', 15));

        return response()->json($users, 200);
    }

    public function getFacultyStudents(Request $request): JsonResponse
    {
        $coordinator = $request->user();

        if ($coordinator->role_id !== 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only Marketing Coordinators can access this list.'
            ], 403);
        }

        if (!$coordinator->faculty_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not assigned to any faculty.'
            ], 404);
        }

        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $students = User::where('faculty_id', $coordinator->faculty_id)
            ->whereHas('role', function ($query) {
                $query->where('id', 1);
            })
            ->with(['role', 'faculty'])
            ->paginate($request->integer('per_page', 15));

        if ($students->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No students found for your assigned faculty.',
                'data' => [],
                'meta' => [
                    'total' => 0,
                    'current_page' => 1
                ]
            ], 200);
        }

        return response()->json($students, 200);
    }

    public function getFacultyGuests(Request $request): JsonResponse
    {
        $coordinator = $request->user();

        // 1. Authorization check for Marketing Coordinator
        if ($coordinator->role_id !== 5) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only Marketing Coordinators can access this list.'
            ], 403);
        }

        // 2. Faculty assignment check
        if (!$coordinator->faculty_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not assigned to any faculty.'
            ], 404);
        }

        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        // 3. Fetch guests (Role ID 3) sharing the same faculty_id
        $guests = User::where('faculty_id', $coordinator->faculty_id)
            ->whereHas('role', function ($query) {
                $query->where('id', 3);
            })
            ->with(['role', 'faculty'])
            ->paginate($request->integer('per_page', 15));

        // 4. Handle empty state
        if ($guests->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No guests found for your assigned faculty.',
                'data' => [],
                'meta' => [
                    'total' => 0,
                    'current_page' => 1
                ]
            ], 200);
        }

        return response()->json($guests, 200);
    }

    /**
     * Register a new user. 
     * Enforces university domain validation and password hashing.
     */
    public function store(Request $request): JsonResponse
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
            'password' => ['required', Password::defaults()->min(8)->max(16)],
            'role_id' => 'exists:roles,id',
            'faculty_id' => 'exists:faculty,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    /**
     * Retrieve specific user details including related models.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json($user->load(['role', 'faculty']), 200);
    }

    public function updateProfile(Request $request, $id): JsonResponse
    {
        $user = User::find($id);

        // 1. Not Found Check
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        // 2. Validation
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|min:2',
            'profile_path' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048', // 2MB Max
        ]);

        // 3. Handle Profile Image Upload
        if ($request->hasFile('profile_path')) {
            // Delete old profile image if it exists in storage
            if ($user->profile_path && Storage::disk('public')->exists($user->profile_path)) {
                Storage::disk('public')->delete($user->profile_path);
            }

            // Store new file
            $file = $request->file('profile_path');
            $filename = time() . '_profile_' . $user->id . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $filename, 'public');
            $validated['profile_path'] = $path;
        }

        // 4. Update and Return
        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully.',
            'data' => $user->load(['role', 'faculty'])
        ], 200);
    }

    /**
     * Update general profile information.
     * Email updates must still adhere to the university domain constraint.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac)(\.[a-z]{2,3})?$/i',
                Rule::unique('users')->ignore($user->id)
            ],
            'role_id' => 'exists:roles,id',
            'faculty_id' => 'exists:faculty,id',
        ]);

        $user->update($validated);

        return response()->json($user, 200);
    }

    /**
     * Transition user status (active/inactive/suspended).
     * Note: This replaces the 'destroy' method to preserve data integrity.
     * Requires 'confirm_action' to ensure the UI modal was acknowledged.
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'confirm_action' => 'required|accepted'
        ], [
            'confirm_action.accepted' => 'Please confirm that you want to change the status of this employer profile.'
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "User status transitioned to {$user->status}",
            'data' => $user
        ], 200);
    }

    /**
     * Update the user's password.
     * Validates the current password for security before allowing the change.
     */
    public function updatePassword(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required_with:password|current_password',
            'password' => ['required', 'confirmed', Password::defaults()->min(8)->max(16)],
        ]);

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json(['message' => 'Password updated successfully.'], 200);
    }

    /**
     * Remove the resource. 
     * (Disabled in favor of updateStatus to maintain audit logs).
     */
    public function destroy(string $id): JsonResponse
    {
        return response()->json(['message' => 'Deletion disabled. Use status updates instead.'], 405);
    }
    
    public function toggleTwoFactor(Request $request): JsonResponse
    {
        $user = $request->user();

        // Defensive check: only runs if middleware somehow fails
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $request->validate([
            'current_password' => 'required|current_password',
        ]);

        $user->update([
            'is_2fa_on' => !$user->is_2fa_on,
            'verification_code' => null 
        ]);

        return response()->json([
            'status' => 'success',
            'is_2fa_on' => $user->is_2fa_on
        ]);
    }

    /**
     * Mark the onboarding tour as completed for the authenticated user.
     */
    public function completeTour(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated',
            ], 401);
        }

        $user->update(['is_new_user' => false]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tour marked as completed',
        ], 200);
    }
}
