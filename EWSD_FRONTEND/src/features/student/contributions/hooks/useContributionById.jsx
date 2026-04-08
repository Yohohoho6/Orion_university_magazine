import { useQuery } from "@tanstack/react-query";
import { ContributionService } from "@/api/services/contribution-service";

export const useContributionById = (id) => {
  return useQuery({
    queryKey: ["contribution", id],
    queryFn: () => ContributionService.getContribution(id),
    enabled: !!id,
  });
};
