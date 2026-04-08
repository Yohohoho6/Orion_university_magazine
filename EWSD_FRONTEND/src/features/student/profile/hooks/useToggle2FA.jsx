import { UserService } from "@/api/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const getErrorMessage = (error) => {
  const validationErrors = error?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstFieldErrors = Object.values(validationErrors)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
      return firstFieldErrors[0];
    }
  }

  return error?.response?.data?.message || "Could not update two-factor authentication";
};

export const useToggle2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ current_password }) => UserService.toggle2FA(current_password),
    onSuccess: async (response) => {

      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      
      toast.success(
        response?.message || "Two-factor authentication settings updated.",
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
