import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ContributionService } from "@/api/services/contribution-service";

export const useUpdateContribution = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {
      const payload = {
        title: data.title,
        description: data.description ?? "",
        category_id: data.category_id,
      };

      if (data.file) {
        payload.file = data.file;
      }

      if (data.cover_photo) {
        payload.cover_photo = data.cover_photo;
      }

      return ContributionService.updateContribution(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
      queryClient.invalidateQueries({
        queryKey: ["contribution", variables?.id],
      });
      toast.success("Contribution updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update contribution";
      toast.error(message);
    },
  });
};
