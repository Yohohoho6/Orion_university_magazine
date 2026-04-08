import { AuthService } from "@/api/services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: (data) => {
      toast.success("Password reset OTP was sent to your email!");
      setTimeout(() => navigate("/reset-password", { state: { email: data?.email } }), 2000);
    },
    onError: (err) => console.error("Forgot password error:", err),
  });
};
