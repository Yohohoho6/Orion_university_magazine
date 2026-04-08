import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/api/services/category-service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getCategories,
  });
};
