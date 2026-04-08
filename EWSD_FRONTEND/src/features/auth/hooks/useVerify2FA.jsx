import { AuthService } from "@/api/services/auth-service";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useVerify2FA = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth()
  return useMutation({
    mutationFn: AuthService.verfiy2FA,
    onSuccess: (data) => {
      setUser(data?.user);
      localStorage.setItem("access_token", data.access_token);
      toast.success("Two factor verified successfully!");
      navigate("/");
    },
  });
};
