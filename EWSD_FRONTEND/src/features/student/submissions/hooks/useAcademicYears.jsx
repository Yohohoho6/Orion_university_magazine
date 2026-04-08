import { useQuery } from "@tanstack/react-query";
import { AcademicYearService } from "@/api/services/academic-year-service";

export const useAcademicYears = (page = 1) => {
  return useQuery({
    queryKey: ["academic-years", page],
    queryFn: () => AcademicYearService.getAcademicYears(page),
  });
};
