import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../../api/services/auth-service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const useRegister = () => {
  const navigate = useNavigate();
  const { setUser, setWelcomeMessage } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      if (data?.meta?.is_new_user !== undefined) {
        localStorage.setItem("is_new_user", String(data.meta.is_new_user));
      }
      setUser(data?.user);
      setWelcomeMessage(data?.meta?.welcome_message || null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      const roleName = data?.user?.role?.name;
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
      toast.success("Registration successful!");
    },
    onError: (error) => console.error("Registration error:", error),
  });
};
