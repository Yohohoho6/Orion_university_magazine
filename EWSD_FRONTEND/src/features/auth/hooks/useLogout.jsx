import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthService } from "../../../api/services/auth-service"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-toastify"

export const useLogout = () => {
    const navigate = useNavigate()
    const { setUser, setLastLogin, setWelcomeMessage } = useAuth()
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: AuthService.logout,
        onSuccess: () => {
            localStorage.removeItem("access_token")
            setUser(null)
            setLastLogin(null)
            setWelcomeMessage(null)
            queryClient.removeQueries({ queryKey: ["currentUser"] })
            navigate("/")
            toast.success("Logout successful!")
        }
    })
}