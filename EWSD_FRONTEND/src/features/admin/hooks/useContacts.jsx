import { useQuery } from "@tanstack/react-query";
import { ContactService } from "@/api/services/contactus-service";

export const useContacts = (filters = {}) => {
  return useQuery({
    queryKey: ["contacts", filters],
    queryFn: () => ContactService.getAll(filters),
  });
};