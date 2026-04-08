import { useQuery } from "@tanstack/react-query";
import { ContributionService } from "@/api/services/contribution-service";

export const useCoordinatorDashboard = () => {
  return useQuery({
    queryKey: ["coordinator-dashboard"],
    queryFn: ContributionService.getCoordinatorDashboard,
    staleTime: 0, 
  });
};
