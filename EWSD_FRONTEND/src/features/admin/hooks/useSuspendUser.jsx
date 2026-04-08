import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { toast } from "react-toastify";

export const useUpdateUserStatus = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => UserService.updateUserStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data?.message || "User status updated.");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update user status";
      toast.error(message);
    },
  });
};
