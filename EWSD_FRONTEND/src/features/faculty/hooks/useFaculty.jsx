import { useQuery } from "@tanstack/react-query";
import { FacultyService } from "@/api/services/faculty-service";

export const useFaculties = () => {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: FacultyService.getFaculties,
  });
};
