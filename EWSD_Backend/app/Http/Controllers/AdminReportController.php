<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Contribution;
use App\Models\Faculty;
use App\Models\PageView;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminReportController extends Controller
{
    public function report(): JsonResponse
    {
        try {
            // Get active academic year
            $activeAcademicYear = AcademicYear::where('is_active', true)->first();

            // TOTAL USERS
            $totalUsers = User::count();

            // ACTIVE USERS
            $activeStudents = User::where('role_id', 1)
                ->where('status', 'active')
                ->count();

            $facultyUsers = User::whereNotNull('faculty_id')
                ->where('status', 'active')
                ->count();

            // TOTAL CONTRIBUTIONS (only from active academic year)
            $totalContributions = $activeAcademicYear 
                ? Contribution::where('academic_year_id', $activeAcademicYear->id)->count()
                : Contribution::count();

            // CONTRIBUTIONS BY FACULTY + exception alerts + contributors count (only from active academic year)
            $contributionsByFaculty = Faculty::select('id','name')
                ->get()
                ->map(function ($faculty) use ($activeAcademicYear) {
                    $contributionQuery = $activeAcademicYear 
                        ? Contribution::where('academic_year_id', $activeAcademicYear->id)->where('faculty_id', $faculty->id)
                        : Contribution::where('faculty_id', $faculty->id);

                    // Count unique contributors (users) for this faculty
                    $contributorsCount = (clone $contributionQuery)
                        ->distinct('user_id')
                        ->count('user_id');

                    // Count contributions with no marketing coordinator comment
                    $exceptionAlerts = (clone $contributionQuery)
                        ->whereDoesntHave('comments', function ($query) {
                            $query->whereHas('user.role', function ($q) {
                                $q->where('name', 'marketing_coordinator');
                            });
                        })
                        ->count();

                    // Get contributions count
                    $contributionsCount = (clone $contributionQuery)->count();

                    return [
                        'id' => $faculty->id,
                        'name' => $faculty->name,
                        'contributions_count' => $contributionsCount,
                        'contributors_count' => $contributorsCount,
                        'exception_alerts' => $exceptionAlerts
                    ];
                });

            // GLOBAL EXCEPTION ALERTS (total alerts)
            $totalAlerts = $contributionsByFaculty->sum('exception_alerts');

            // RECENT CONTRIBUTIONS (last 3, only from active academic year)
            $recentContributionsQuery = $activeAcademicYear 
                ? Contribution::where('academic_year_id', $activeAcademicYear->id)
                : Contribution::query();

            $recentContributions = (clone $recentContributionsQuery)->with([
                    'user:id,name,profile_path',
                    'faculty:id,name'
                ])
                ->latest()
                ->take(3)
                ->get();

            // DAYS TO CLOSURE (from active academic year)
            $closureDate = $activeAcademicYear && $activeAcademicYear->closure_date
                ? Carbon::parse($activeAcademicYear->closure_date)
                : null;
            
            // Calculate days to closure (positive = remaining, negative = passed)
            $daysToClosure = $closureDate ? (int) Carbon::now()->diffInDays($closureDate) : null;
            $deadlinePassed = $daysToClosure !== null && $daysToClosure < 0;

          // Count of users per browser (exclude null)
            $browserStats = User::select('browser', DB::raw('count(*) as total'))
                ->whereNotNull('browser')
                ->groupBy('browser')
                ->get();

            // Total users with a valid browser
            $totalBrowsers = User::whereNotNull('browser')->count();

            // TOTAL PAGE VIEWS (sum of all views)
            $totalPageViews = PageView::sum('views');

            // MOST VIEWED PAGES
            $mostViewedPages = PageView::orderByDesc('views')
                ->take(5)
                ->get();

            // MOST ACTIVE USERS (Top 10 contributors, only from active academic year)
            $mostActiveUsersQuery = $activeAcademicYear 
                ? Contribution::where('academic_year_id', $activeAcademicYear->id)
                : Contribution::query();

            $mostActiveUsers = (clone $mostActiveUsersQuery)->with('user:id,name,profile_path')
                ->select('user_id', DB::raw('count(*) as total_contributions'))
                ->groupBy('user_id')
                ->orderByDesc('total_contributions')
                ->take(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->user->name ?? 'Unknown',
                        'profile_path' => $item->user->profile_path ?? null,
                        'total_contributions' => $item->total_contributions
                    ];
                });

            return response()->json([
                'total_users' => $totalUsers,
                'active_users' => $activeStudents,
                'total_contributions' => $totalContributions,
                'current_academic_year' => $activeAcademicYear ? $activeAcademicYear->name : null,
                'days_to_closure' => $daysToClosure,
                'deadline_passed' => $deadlinePassed,
                'total_alerts' => $totalAlerts,
                'contributions_by_faculty' => $contributionsByFaculty,
                'recent_contributions' => $recentContributions,
                'most_active_users' => $mostActiveUsers,

                'total_browsers' => $totalBrowsers,
                'browser_stats' => $browserStats,
                'total_page_views' => $totalPageViews,
                'most_viewed_pages' => $mostViewedPages
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
