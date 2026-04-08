import { useMutation } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { toast } from "react-toastify";

export const useUpdatePassword = (onSuccess) => {
  return useMutation({
    mutationFn: ({ id, payload }) => UserService.updatePassword(id, payload),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to update password";
      toast.error(message);
    },
  });
};
