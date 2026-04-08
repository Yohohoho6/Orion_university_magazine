import { AuthService } from "@/api/services/auth-service"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const useResetPassword = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: AuthService.resetPassword,
        onSuccess: () => {
            toast.success("Password reset successfully. Please login with your new password.")
            navigate("/login")
        }
    })
}