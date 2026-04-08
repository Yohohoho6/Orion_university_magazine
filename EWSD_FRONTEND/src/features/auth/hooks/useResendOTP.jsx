import { AuthService } from "@/api/services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRensendOTP = () => {
  return useMutation({
    mutationFn: AuthService.resendOTP,
    onSuccess: () => {
      toast.success("OTP resent successfully!");
    },
    onError: (error) => {
      console.error("OTP resent error:", error);
    },
  });
};
