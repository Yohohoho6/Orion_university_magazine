<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicYearController extends Controller
{

    public function getActiveList(): JsonResponse
    {
        $activeYears = AcademicYear::where('is_active', true)
            ->latest('start_date')
            ->get();

        if ($activeYears->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No active academic years found for submissions.',
                'data' => []
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $activeYears
        ], 200);
    }
    
    public function index(Request $request): JsonResponse   
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'active_only' => 'nullable|boolean',
        ]);

        $years = AcademicYear::query()
            ->when($request->boolean('active_only'), function ($query) {
                $query->where('is_active', true);
            })
            ->latest('start_date')
            ->paginate($request->integer('per_page', 15));

        return response()->json($years, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:academic_years,name|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'closure_date' => 'required|date|after:start_date|before:end_date',
            'final_closure_date' => 'required|date|after:closure_date|before_or_equal:end_date',
            'is_active' => 'boolean',
        ]);

        $year = AcademicYear::create($validated);

        return response()->json($year, 201);
    }

    public function show($id): JsonResponse
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return response()->json([
                'status' => 'error',
                'message' => 'Academic Year not found'
            ], 404);
        }

        return response()->json($academicYear, 200);
    }

    public function update(Request $request, AcademicYear $academicYear): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('academic_years')->ignore($academicYear->id)],
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'closure_date' => 'sometimes|date|after:start_date|before:end_date',
            'final_closure_date' => 'sometimes|date|after:closure_date|before_or_equal:end_date',
        ]);

        $academicYear->update($validated);

        return response()->json($academicYear, 200);
    }

    public function updateStatus(Request $request, AcademicYear $academicYear): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        if ($validated['is_active']) {
            AcademicYear::where('id', '!=', $academicYear->id)->update(['is_active' => false]);
        }

        $academicYear->update(['is_active' => $validated['is_active']]);

        return response()->json([
            'message' => "Academic year status set to " . ($academicYear->is_active ? 'Active' : 'Inactive'),
            'data' => $academicYear
        ], 200);
    }

    public function destroy(string $id): JsonResponse
    {
        return response()->json(['message' => 'Deletion disabled. Use status updates instead.'], 405);
    }
}
