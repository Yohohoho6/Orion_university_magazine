import { useQuery } from "@tanstack/react-query";
import { ContributionService } from "@/api/services/contribution-service";

const GUEST_DASHBOARD_QUERY_KEY = "guest-dashboard";
const STALE_TIME = 1000 * 60 * 5;

export const useGuestDashboard = (page = 1, categoryId = null, academicYearId = null, search = null) => {
    return useQuery({
        queryKey: [GUEST_DASHBOARD_QUERY_KEY, page, categoryId, academicYearId, search],
        queryFn: () => ContributionService.getGuestDashboard(page, categoryId, academicYearId, search),
        staleTime: STALE_TIME,
        refetchOnWindowFocus: true,
    });
};
