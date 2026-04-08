import { useQuery } from "@tanstack/react-query";
import { ContributionService } from "@/api/services/contribution-service";

export const useSelectedContributions = (page, categoryId, academicYearId, search) => {
    return useQuery({
        queryKey: ["selectedContributions", page, categoryId, academicYearId, search],
        queryFn: () => ContributionService.getSelectedContributions(page, categoryId, academicYearId, search),
    });
};