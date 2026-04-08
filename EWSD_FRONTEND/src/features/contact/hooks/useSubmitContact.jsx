import { useMutation } from "@tanstack/react-query";
import { ContactService } from "@/api/services/contactus-service";
import { toast } from "react-toastify";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (payload) => ContactService.store(payload),
    onSuccess: () => {
      toast.success("Message sent successfully! We'll respond within 24-48 hours.");
    },
    onError: (error) => {
      console.error("Contact submission failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send message. Please try again."
      );
    },
  });
};