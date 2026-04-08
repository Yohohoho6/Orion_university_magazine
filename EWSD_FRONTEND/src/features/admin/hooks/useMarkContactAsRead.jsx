import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/api/services/contactus-service";
import { toast } from "react-toastify";

export const useMarkContactAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ContactService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Message marked as read");
    },
    onError: (error) => {
      console.error("Failed to mark as read:", error);
      toast.error(error?.response?.data?.message || "Failed to mark as read");
    },
  });
};