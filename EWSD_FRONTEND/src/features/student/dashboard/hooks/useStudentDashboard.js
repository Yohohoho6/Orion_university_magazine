import { useQuery } from "@tanstack/react-query"
import { ContributionService } from "../../../../api/services/contribution-service"

const STUDENT_DASHBOARD_QUERY_KEY = "student-dashboard"
const STALE_TIME = 0 // 5 minutes
const RETRY_COUNT = 2

/**
 * Custom hook for fetching student dashboard data
 *
 * Features:
 * - Automatic retry on failure (2 attempts)
 * - 0-minute stale time to reduce API calls
 * - Refetches when window regains focus
 * - Caches data across component remounts
 *
 * @returns {Object} React Query result object with data, isLoading, error, refetch
 */
export const useStudentDashboard = () => {
    return useQuery({
        queryKey: [STUDENT_DASHBOARD_QUERY_KEY],
        queryFn: ContributionService.getStudentDashboard,
        staleTime: STALE_TIME,
        refetchOnWindowFocus: true,
        retry: RETRY_COUNT,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
};
