import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { toast } from "react-toastify";

export const useUpdateUser = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => UserService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
};
