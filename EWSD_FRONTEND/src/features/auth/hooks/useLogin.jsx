import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/api/services/auth-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setWelcomeMessage } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials) => AuthService.login(credentials),
    onSuccess: async (data) => {
      if (data?.status === "2fa_required") {
        navigate("/two-factor-auth", { replace: true, state: { email: data?.email } });
      }
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        setUser(data?.user)
        
        if (data?.meta?.is_first_login) {
          localStorage.setItem("is_new_user", "true");
          setWelcomeMessage(data?.meta?.welcome_message || "Welcome!");
        } else {
          localStorage.setItem("is_new_user", "false");
          setWelcomeMessage(null);
        }

        await queryClient.invalidateQueries({ queryKey: ["currentUser"] })

        const roleName = data?.user?.role?.name

        if (roleName === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (roleName === "student") {
          navigate("/student/dashboard", { replace: true });
        } else if (roleName === "marketing_coordinator") {
          navigate("/marketing-coordinator/dashboard", { replace: true });
        } else if (roleName === "marketing_manager") {
          navigate("/marketing-manager/dashboard", { replace: true });
        } else if (roleName === "guest") {
          navigate("/guest/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        toast.success("Login successful");
      }
    },
    onError: (error) => {
      console.error(error)
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    },
  });
};
