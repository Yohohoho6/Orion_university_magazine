import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { toast } from "react-toastify";

export const useCreateUser = (onSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to create user";
      toast.error(message);
    },
  });
};
