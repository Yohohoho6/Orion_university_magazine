import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";

export const useGuestList = (page = 1) => {
  return useQuery({
    queryKey: ["faculty-guests", page],
    queryFn: () => UserService.getFacultyGuests(page),
    staleTime: 0,
  });
};