<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Category;
use App\Models\Contribution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuestReportController extends Controller
{
    /**
     * Guest Dashboard: returns user info and selected contributions with filters
     */
    public function dashboard(Request $request): JsonResponse
    {
        $guest = $request->user();

        if (! $guest->faculty_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not assigned to any faculty.',
            ], 403);
        }

        $query = Contribution::with([
            'user:id,name,profile_path',
            'category:id,name',
            'faculty:id,name',
        ])
            ->where('status', 'selected')
            ->where('faculty_id', $guest->faculty_id);

        // Filter by academic_year_id
        if ($request->query('academic_year_id')) {
            $query->where('academic_year_id', $request->query('academic_year_id'));
        } else {
            $activeYear = AcademicYear::where('is_active', true)->first();
            if ($activeYear) {
                $query->where('academic_year_id', $activeYear->id);
            }
        }

        // Filter by category_id
        if ($request->query('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        // Search by student name or contribution title
        if ($request->query('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        $contributions = $query->latest()->paginate($request->integer('per_page', 15));

        $activeYear = AcademicYear::where('is_active', true)->first();
        $academicYears = AcademicYear::orderBy('start_date', 'desc')->get(['id', 'name', 'start_date', 'end_date']);
        $categories = Category::orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'user' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'profile_url' => $guest->profile_url,
                'faculty' => $guest->faculty,
                'role' => $guest->role,
            ],
            'academic_year' => $activeYear?->only(['id', 'name']),
            'academic_years' => $academicYears,
            'categories' => $categories,
            'contributions' => $contributions,
        ], 200);
    }
}
