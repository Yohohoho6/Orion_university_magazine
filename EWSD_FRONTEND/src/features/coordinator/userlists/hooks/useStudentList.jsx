import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";

export const useStudentList = (page = 1) => {
  return useQuery({
    queryKey: ["faculty-students", page],
    queryFn: () => UserService.getFacultyStudents(page),
  });
};
