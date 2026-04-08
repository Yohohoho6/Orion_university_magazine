import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { toast } from "react-toastify";

const getErrorMessage = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstFieldErrors = Object.values(validationErrors)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
      return firstFieldErrors[0];
    }
  }

  return error?.response?.data?.message || "Failed to update profile";
};

export const useUpdateProfile = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => UserService.updateProfile(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(response?.message || "Profile updated successfully!");
      onSuccess?.(response?.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
