import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContributionService } from "@/api/services/contribution-service";
import { toast } from "react-toastify";

export const useStoreContribution = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const payload = {
        title: data.title,
        abstract: data.abstract ?? "",
        description: data.description ?? "",
        category_id: data.category_id,
        terms_accepted: data.terms_accepted ? "1" : "0",
        file: data.file,
      };
      
      if (data.cover_photo) {
        payload.cover_photo = data.cover_photo;
      }
      
      return ContributionService.storeContribution(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      toast.success("Contribution submitted successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to submit contribution";
      toast.error(message);
    },
  });
};
