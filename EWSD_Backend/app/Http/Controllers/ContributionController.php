<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContributionResource;
use App\Jobs\SummarizeContribution;
use App\Mail\ContributionRejectedNotification;
use App\Mail\ContributionSelectedNotification;
use App\Mail\ContributionUpdatedNotification;
use App\Mail\NewContributionNotification;
use App\Models\AcademicYear;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use ZipArchive;

class ContributionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'status' => ['nullable', Rule::in(['pending', 'selected', 'rejected', 'commented'])],
            'search' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $user = $request->user();
        $query = Contribution::with(['user:id,name,profile_path', 'category', 'academicYear', 'faculty']);

        // 1. Role-Based Access Control
        if ($user->role->name === 'student') {
            $query->where('user_id', $user->id);
        } elseif ($user->role->name === 'marketing_coordinator') {
            $query->where('faculty_id', $user->faculty_id);
        }

        // 2. Search Logic
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($subQuery) use ($search) {
                $subQuery->where('title', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('academicYear', function ($a) use ($search) {
                        $a->where('name', 'LIKE', "%{$search}%");
                    });
            });
        });

        // 3. Filters
        $query->when($request->category_id, fn($q, $id) => $q->where('category_id', $id));
        $query->when($request->status, fn($q, $st) => $q->where('status', $st));

        $contributions = $query->latest()->paginate($request->integer('per_page', 15));

        if ($contributions->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No contributions found matching your criteria.',
                'data' => [],
                'meta' => [
                    'current_page' => $contributions->currentPage(),
                    'total' => 0
                ]
            ], 200);
        }

        return response()->json($contributions, 200);
    }

    public function store(Request $request): JsonResponse
    {
        // --- START: Academic Year Logic ---
        $activeYear = AcademicYear::where('is_active', true)->first();

        if (!$activeYear) {
            return response()->json([
                'status' => 'error',
                'message' => 'Submissions are currently closed. No active academic year found.'
            ], 403);
        }

        if (now()->gt($activeYear->closure_date)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The submission deadline (' . $activeYear->closure_date->format('Y-m-d') . ') for this academic year has passed.'
            ], 403);
        }
        // --- END: Academic Year Logic ---

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:doc,docx,jpg,jpeg,png,pdf|max:5120',
            'cover_photo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048', // Kept from main
            'terms_accepted' => 'required|accepted',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('contributions', $filename, 'public');
            $validated['file_path'] = $path;
        }

        // Cover Photo Handling (Kept from main)
        if ($request->hasFile('cover_photo')) {
            $coverFile = $request->file('cover_photo');
            $coverFilename = time() . '_cover_' . $coverFile->getClientOriginalName();
            $coverPath = $coverFile->storeAs('contributions/covers', $coverFilename, 'public');
            $validated['cover_photo_path'] = $coverPath;
        }

        unset($validated['file']);
        unset($validated['cover_photo']);

        $user = $request->user();

        $validated['user_id'] = $user->id;
        $validated['faculty_id'] = $user->faculty_id;
        $validated['academic_year_id'] = $activeYear->id; // Assigned automatically from active year
        $validated['status'] = 'pending';

        $contribution = Contribution::create($validated);

        // --- START: Email Notification ---
        $coordinator = User::where('faculty_id', $user->faculty_id)
            ->where('role_id', 5)
            ->first();

        if ($coordinator) {
            $contribution->load('user');
            Mail::to($coordinator->email)
                ->send(new NewContributionNotification($contribution));
        }
        // --- END: Email Notification ---
        if ($coordinator) {
            $notificationController = new NotificationController();
            $notificationRequest = new Request([
                'name' => 'New Contribution Submitted',
                'description' => $user->name . ' has submitted a new contribution: "' . $contribution->title . '"',
                'remind' => false,
                'user_id' => $coordinator->id,
                'contribution_id' => $contribution->id
            ]);

            $notificationController->store($notificationRequest);
        }

        return response()->json([
            'message' => 'Contribution uploaded successfully and coordinator notified.',
            'data' => $contribution
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $contribution = Contribution::with([
            'user:id,name',
            'category:id,name',
            'academicYear:id,name',
            'faculty:id,name'
        ])->find($id);

        if (!$contribution) {
            return response()->json([
                'success' => false,
                'message' => 'Contribution not found'
            ], 404);
        }

        $validExtensions = ['pdf', 'doc', 'docx'];
        $extension = pathinfo($contribution->file_path, PATHINFO_EXTENSION);

        // 2. Only trigger AI if summary is empty AND the file type is valid
        if (empty($contribution->summary) && in_array(strtolower($extension), $validExtensions)) {
            SummarizeContribution::dispatch($contribution);
            
            // Optional: Let the frontend know a summary is being generated
            $contribution->summary = "Generating AI summary...";
        }

        return response()->json([
            'success' => true,
            'data' => $contribution
        ], 200);
    }

    public function update(Request $request, Contribution $contribution): JsonResponse
    {
        $user = $request->user();

        if ($user->role->name === 'student' && $contribution->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not allowed to update this contribution.'
            ], 403);
        }

        $academicYear = $contribution->academicYear;

        if ($academicYear && now()->greaterThan($academicYear->final_closure_date)) {
            return response()->json([
                'message' => 'Final closure date has passed. You cannot update this contribution.'
            ], 403);
        }


        $activeYear = AcademicYear::where('is_active', true)->first();

        // Updates are allowed until the Final Closure Date
        if ($activeYear && now()->gt($activeYear->final_closure_date)) {
            return response()->json([
                'status' => 'error',
                'message' => 'The final update deadline (' . $activeYear->final_closure_date->format('Y-m-d') . ') has passed.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'file' => 'sometimes|file|mimes:doc,docx,jpg,jpeg,png,pdf|max:5120',
            'cover_photo' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($contribution->file_path && Storage::disk('public')->exists($contribution->file_path)) {
                Storage::disk('public')->delete($contribution->file_path);
            }
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('contributions', $filename, 'public');
            $validated['file_path'] = $path;
        }

        if ($request->hasFile('cover_photo')) {
            if ($contribution->cover_photo_path && Storage::disk('public')->exists($contribution->cover_photo_path)) {
                Storage::disk('public')->delete($contribution->cover_photo_path);
            }
            $coverFile = $request->file('cover_photo');
            $coverFilename = time() . '_cover_' . $coverFile->getClientOriginalName();
            $coverPath = $coverFile->storeAs('contributions/covers', $coverFilename, 'public');
            $validated['cover_photo_path'] = $coverPath;
        }

        unset($validated['file']);
        unset($validated['cover_photo']);

        if ($user->role->name === 'student') {
            $validated['status'] = 'pending';
        }

        $contribution->update($validated);

        if ($user->role->name === 'student') {
            $coordinator = User::where('faculty_id', $contribution->faculty_id)
                ->where('role_id', 5) // Coordinator Role ID
                ->first();

            if ($coordinator) {
                Mail::to($coordinator->email)
                    ->send(new ContributionUpdatedNotification($contribution->load('user')));
            }

            if ($coordinator) {
                $notificationController = new NotificationController();
                $notificationRequest = new Request([
                    'name' => 'Contribution Updated',
                    'description' => $user->name . ' has updated their contribution: "' . $contribution->title . '"',
                    'remind' => false,
                    'user_id' => $coordinator->id,
                    'contribution_id' => $contribution->id
                ]);

                $notificationController->store($notificationRequest);
            }
        }

        return response()->json([
            'message' => 'Contribution updated successfully and coordinator notified.',
            'data' => $contribution->load(['user:id,name', 'category', 'academicYear', 'faculty'])
        ], 200);
    }

    public function selectContributions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:contributions,id',
            'action' => ['required', Rule::in(['selected', 'rejected'])],
        ]);

        $ids = $validated['ids'];

        // If selecting → must have comments
        if ($validated['action'] === 'selected') {
            $contributions = Contribution::withCount('comments')
                ->whereIn('id', $validated['ids'])
                ->get();

            $invalid = $contributions->filter(fn($c) => $c->comments_count === 0);

            if ($invalid->isNotEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The following contributions cannot be selected because they have no comments.',
                    'invalid_ids' => $invalid->pluck('id')
                ], 422);
            }
        }

        if ($validated['action'] === 'rejected') {
            $contributions = Contribution::withCount('comments')
                ->whereIn('id', $ids)
                ->get();

            $invalid = $contributions->filter(fn($c) => $c->comments_count === 0);

            if ($invalid->isNotEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The following contributions cannot be rejected because they have no comments.',
                    'invalid_ids' => $invalid->pluck('id')
                ], 422);
            }
        }

        DB::transaction(function () use ($validated, $ids) {
            Contribution::whereIn('id', $ids)->update([
                'status' => $validated['action'],
                'is_selected' => $validated['action'] === 'selected'
            ]);

            if ($validated['action'] === 'selected') {
                // notify each student
                $selectedContributions = Contribution::with('user')
                    ->whereIn('id', $ids)
                    ->get();

                foreach ($selectedContributions as $contribution) {
                    Mail::to($contribution->user->email)
                        ->send(new ContributionSelectedNotification($contribution));
                    
                    $notificationController = new NotificationController();
                    $notificationRequest = new Request([
                        'name' => 'Contribution Selected',
                        'description' => 'Congratulations! Your contribution "' . $contribution->title . '" has been selected.',
                        'remind' => false,
                        'user_id' => $contribution->user_id,
                        'contribution_id' => $contribution->id
                    ]);
                    $notificationController->store($notificationRequest);
                }
            } else if ($validated['action'] === 'rejected') {
                // notify each student for rejection
                $rejectedContributions = Contribution::with('user')
                    ->whereIn('id', $ids)
                    ->get();

                foreach ($rejectedContributions as $contribution) {
                    Mail::to($contribution->user->email)
                        ->send(new ContributionRejectedNotification($contribution));
                    
                    $notificationController = new NotificationController();
                    $notificationRequest = new Request([
                        'name' => 'Contribution Rejected',
                        'description' => 'Your contribution "' . $contribution->title . '" was not selected. Please check comments for feedback.',
                        'remind' => false,
                        'user_id' => $contribution->user_id,
                        'contribution_id' => $contribution->id
                    ]);
                    $notificationController->store($notificationRequest);
                }
            }
        });

        if ($validated['action'] === 'selected') {
            return response()->json([
                'status' => 'success',
                'message' => count($ids) . ' contributions successfully selected and students notified.',
                'selected_ids' => $ids
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => count($validated['ids']) . ' contributions ' . $validated['action'] . ' successfully.',
            'affected_ids' => $validated['ids']
        ], 200);
    }
    public function destroy(string $id): JsonResponse
    {
        return response()->json(['message' => 'Deletion disabled to maintain academic history.'], 405);
    }

    public function getExceptionReport()
    {
        // Requirements check: Contributions without a comment after 14 days
        $exceptions = Contribution::where('status', 'pending')
            ->where('created_at', '<=', now()->subDays(14))
            ->with(['user', 'user.faculty'])
            ->get();

        return response()->json($exceptions);
    }

    public function CoordinatorDashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // 1. Get the Active Academic Year
        $activeYear = AcademicYear::where('is_active', true)->first();

        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found.'], 404);
        }

        // Base query scoped to the active year and the coordinator's faculty
        $baseQuery = Contribution::where('academic_year_id', $activeYear->id)
                                ->where('faculty_id', $user->faculty_id);

        // 2. Totals by status
        $statusCounts = (clone $baseQuery)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // 3. Overdue Pending (Pending items older than 14 days - standard university policy)
        $overdueCount = (clone $baseQuery)
            ->where('status', 'pending')
            ->where('created_at', '<', now()->subDays(14))
            ->count();

        // 4. Latest Contributions
        $latest = (clone $baseQuery)
            ->with(['user:id,name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'student_name' => $c->user->name,
                'status' => $c->status,
                'created_at' => $c->created_at,
            ]);

        // 5. Oldest Pending
        $oldestPending = (clone $baseQuery)
            ->where('status', 'pending')
            ->with(['user:id,name'])
            ->oldest()
            ->take(5)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'student_name' => $c->user->name,
                'status' => $c->status,
                'created_at' => $c->created_at,
            ]);

        // 6. Weekly Submission Trend (Last 8 ISO weeks, Monday start)
        $trend = (clone $baseQuery)
            ->select(
                DB::raw("DATE_FORMAT(DATE_SUB(created_at, INTERVAL WEEKDAY(created_at) DAY), '%Y-%m-%d') as week"),
                DB::raw('WEEK(created_at, 3) as week_number'), // ISO week number
                DB::raw('count(*) as count')
            )
            ->groupBy('week', 'week_number')
            ->orderBy('week', 'desc') // grab latest 8 then resort
            ->take(8)
            ->get()
            ->sortBy('week')
            ->values()
            ->map(fn($item) => [
                'week' => $item->week,
                'week_number' => (int) $item->week_number,
                'count' => (int) $item->count,
            ]);

        // 7. Status Distribution (for Charts)
        $distribution = collect(['pending', 'commented', 'selected', 'rejected'])->map(function($status) use ($statusCounts) {
            return [
                'status' => $status,
                'count' => $statusCounts->get($status, 0)
            ];
        });

        // 8. Top Categories (highest submission counts for this faculty & academic year)
        $topCategories = (clone $baseQuery)
            ->leftJoin('categories', 'contributions.category_id', '=', 'categories.id')
            ->select(DB::raw('COALESCE(categories.name, "Uncategorized") as category_name'), DB::raw('count(*) as count'))
            ->groupBy('category_name')
            ->orderByDesc('count')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'category_name' => $item->category_name,
                'count' => (int) $item->count,
            ]);

        return response()->json([
            'academic_year' => [
                'id' => $activeYear->id,
                'name' => $activeYear->name,
                'closure_date' => $activeYear->closure_date,
                'final_closure_date' => $activeYear->final_closure_date,
                'is_active' => (bool)$activeYear->is_active,
            ],
            'totals' => [
                'pending' => $statusCounts->get('pending', 0),
                'selected' => $statusCounts->get('selected', 0),
                'rejected' => $statusCounts->get('rejected', 0),
                'commented' => $statusCounts->get('commented', 0),
            ],
            'overdue_count' => $overdueCount,
            'latest_contributions' => $latest,
            'oldest_pending' => $oldestPending,
            'submission_trend' => $trend,
            'status_distribution' => $distribution,
            'top_categories' => $topCategories
        ], 200);
    }

    /**
     * Download the primary contribution file (DOCX, PDF, etc.)
     */
    public function downloadFile(Contribution $contribution)
    {
        if (!$contribution->file_path || !Storage::disk('public')->exists($contribution->file_path)) {
            return response()->json(['message' => 'File not found on server.'], 404);
        }

        $path = storage_path('app/public/' . $contribution->file_path);
        
        // Optional: Custom filename for the user
        $friendlyName = str_replace(' ', '_', $contribution->title) . '.' . pathinfo($path, PATHINFO_EXTENSION);

        return response()->download($path, $friendlyName);
    }

    /**
     * Download the cover photo specifically
     */
    public function downloadCover(Contribution $contribution)
    {
        if (!$contribution->cover_photo_path || !Storage::disk('public')->exists($contribution->cover_photo_path)) {
            return response()->json(['message' => 'Cover photo not found.'], 404);
        }

        $path = storage_path('app/public/' . $contribution->cover_photo_path);
        
        return response()->download($path);
    }

    public function managerDashboard(Request $request): JsonResponse
    {
        // 1. Get the Active Academic Year
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found.'], 404);
        }

        // Optional: Filter by specific faculty if passed in request, else show all
        $facultyId = $request->query('faculty_id');

        // Base query scoped to the active year
        $query = Contribution::where('academic_year_id', $activeYear->id);
        
        if ($facultyId) {
            $query->where('faculty_id', $facultyId);
        }

        // 2. Global Totals
        $totals = [
            'total_contributions' => (clone $query)->count(),
            'total_students' => (clone $query)->distinct('user_id')->count('user_id'),
            'total_faculties' => (clone $query)->distinct('faculty_id')->count('faculty_id'),
        ];

        // 3. Faculty Performance Comparison (Enhanced)
        $facultyComparison = DB::table('faculty')
            ->leftJoin('contributions', function($join) use ($activeYear) {
                $join->on('faculty.id', '=', 'contributions.faculty_id')
                    ->where('contributions.academic_year_id', '=', $activeYear->id);
            })
            ->select(
                'faculty.id',
                'faculty.name',
                // Total contributions
                DB::raw('count(contributions.id) as total_contributions'),
                // Count only those where status is 'selected'
                DB::raw('sum(case when contributions.status = "selected" then 1 else 0 end) as selected_count'),
                // Count unique students who submitted
                DB::raw('count(distinct contributions.user_id) as contributor_count')
            )
            ->groupBy('faculty.id', 'faculty.name')
            ->get();

        // 4. Status Distribution (Global)
        $statusDistribution = (clone $query)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // 5. High-Engagement Students (Leaderboard)
        $topContributors = (clone $query)
            ->with('user:id,name,profile_path')
            ->select('user_id', DB::raw('count(*) as count'))
            ->groupBy('user_id')
            ->orderBy('count', 'desc')
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->user->name,
                'profile_path' => $item->user->profile_path,
                'count' => $item->count
            ]);

        // 6. Monthly Trend for Year
        $monthlyTrend = (clone $query)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%b %Y') as month"), 
                DB::raw('count(*) as count'),
                DB::raw("MIN(created_at) as sort_date") // Add a hidden column for sorting
            )
            ->groupBy('month')
            ->orderBy('sort_date', 'asc') // Sort by the actual date, not the string
            ->get()
            ->map(fn($item) => [
                'month' => $item->month,
                'count' => $item->count
            ]);

        return response()->json([
            'academic_year' => $activeYear->only(['id', 'name', 'is_active']),
            'summary' => $totals,
            'faculty_performance' => $facultyComparison,
            'status_distribution' => $statusDistribution,
            'top_contributors' => $topContributors,
            'monthly_trend' => $monthlyTrend
        ], 200);
    }

    public function studentDashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $activeYear = AcademicYear::where('is_active', true)->first();

        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found.'], 404);
        }

        // 1. Student's Personal Stats
        $personalStats = Contribution::where('user_id', $user->id)
            ->where('academic_year_id', $activeYear->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalPersonal = $personalStats->sum();

        // 2. Faculty Benchmarks (Average Rates)
        // We calculate the success rate of the entire faculty to show the student the "Standard"
        $facultyTotals = Contribution::where('faculty_id', $user->faculty_id)
            ->where('academic_year_id', $activeYear->id)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalFaculty = $facultyTotals->sum();

        // 3. Calculate Rates
        $calculateRate = function ($count, $total) {
            return $total > 0 ? round(($count / $total) * 100, 1) : 0;
        };

        // 4. Get Student's Notifications
        $notifications = DB::table('notifications')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get(['id', 'name', 'description', 'created_at']);

        return response()->json([
            'academic_year' => [
                'id' => $activeYear->id,
                'name' => $activeYear->name,
                'start_date' => $activeYear->start_date,
                'end_date' => $activeYear->end_date,
                'closure_date' => $activeYear->closure_date,
                'final_closure_date' => $activeYear->final_closure_date,
                'is_active' => (bool)$activeYear->is_active,
            ],
            'student_info' => [
                'name' => $user->name,
                'faculty' => DB::table('faculty')->where('id', $user->faculty_id)->value('name'),
            ],
            'personal_metrics' => [
                'total_submissions' => $totalPersonal,
                'selection_rate' => $calculateRate($personalStats->get('selected', 0), $totalPersonal) . '%',
                'rejection_rate' => $calculateRate($personalStats->get('rejected', 0), $totalPersonal) . '%',
            ],
            'faculty_comparison' => [
                'average_faculty_selection_rate' => $calculateRate($facultyTotals->get('selected', 0), $totalFaculty) . '%',
                'average_faculty_rejection_rate' => $calculateRate($facultyTotals->get('rejected', 0), $totalFaculty) . '%',
                'your_contribution_share' => $calculateRate($totalPersonal, $totalFaculty) . '%', 
            ],
            'status_breakdown' => [
                'pending' => $personalStats->get('pending', 0),
                'commented' => $personalStats->get('commented', 0),
                'selected' => $personalStats->get('selected', 0),
                'rejected' => $personalStats->get('rejected', 0),
            ],
            'recent_activity' => Contribution::where('user_id', $user->id)
                ->where('academic_year_id', $activeYear->id)
                ->latest()
                ->take(3)
                ->get(['id', 'title', 'status', 'created_at']),
            'notifications' => $notifications
        ], 200);
    }

    // Download contributions for a specific faculty
    public function downloadFacultyZip(Request $request, $facultyId)
    {

        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found.'], 404);
        }
        
        if (now()->lt($activeYear->final_closure_date)) {
        return response()->json([
            'message' => 'Download is only allowed after final closure date.'
        ], 403);
        // Optional status filter, defaults to 'selected'
        $status = $request->get('status', 'selected');
        
        // Validate faculty exists
        $faculty = Faculty::find($facultyId);
        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found.'], 404);
        }
        
        // Fetch contributions for the specific faculty with the given status
        $contributions = Contribution::where('faculty_id', $facultyId)
            ->where('status', $status)
            ->whereNotNull('file_path')
            ->get();
            
        if ($contributions->isEmpty()) {
            return response()->json([
                'message' => 'No selected contributions found for this faculty',
                'status' => $status
            ], 404);
        }
        
        // Create ZIP file
        $zipFileName = 'Faculty_' . $faculty->name . '_' . ucfirst($status) . '_Contributions_' . date('Ymd_His') . '.zip';
        $zipPath = storage_path('app/public/contributions/' . $zipFileName);
        
        // Ensure directory exists
        if (!file_exists(storage_path('app/public/contributions/'))) {
            mkdir(storage_path('app/public/contributions/'), 0755, true);
        }
        
        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            foreach ($contributions as $contribution) {
                $filePath = storage_path('app/public/' . $contribution->file_path);
                if (file_exists($filePath)) {
                    // Add file to ZIP with contribution title as filename for clarity
                    $originalName = pathinfo($contribution->file_path, PATHINFO_BASENAME);
                    $contributionTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', $contribution->title);
                    $zip->addFile($filePath, $contributionTitle . '_' . $originalName);
                }
            }
            $zip->close();
        }
        
        // Return the file and delete it after sending to keep the server clean
        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    }

    public function syncAutoReject(Request $request): JsonResponse
    {
        // 1. Identify "Stale" contributions: 
        // - Status is pending
        // - Created more than 14 days ago
        // - Has 0 comments
        $staleContributions = Contribution::where('status', 'pending')
            ->where('created_at', '<=', now()->subDays(14))
            ->whereDoesntHave('comments') 
            ->with('user')
            ->get();

        if ($staleContributions->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'No stale contributions found. System is up to date.'
            ], 200);
        }

        $count = $staleContributions->count();

        DB::transaction(function () use ($staleContributions) {
            foreach ($staleContributions as $contribution) {
                // Update status
                $contribution->update([
                    'status' => 'rejected',
                    'is_selected' => false
                ]);

                // Notify Student via Email
                Mail::to($contribution->user->email)
                    ->send(new ContributionRejectedNotification($contribution));

                // Create In-App Notification
                $notificationController = new NotificationController();
                $notificationRequest = new Request([
                    'name' => 'Auto-Rejection Notice',
                    'description' => 'Your contribution "' . $contribution->title . '" was auto-rejected as it exceeded the 14-day review window without coordinator feedback.',
                    'remind' => false,
                    'user_id' => $contribution->user_id,
                    'contribution_id' => $contribution->id
                ]);
                $notificationController->store($notificationRequest);
            }

            
        });

        return response()->json([
            'status' => 'success',
            'message' => "Successfully auto-rejected {$count} stale contributions and notified students.",
            'affected_count' => $count
        ], 200);
    }

    public function selectedContriubtionsForStudent(Request $request): JsonResponse
    {
        
        $student = auth()->user();

        if (! $student->faculty_id) {
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
            ->where('faculty_id', $student->faculty_id);

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

        return response()->json([
            'contributions' => $contributions,
        ], 200);
    
    }
    
}
