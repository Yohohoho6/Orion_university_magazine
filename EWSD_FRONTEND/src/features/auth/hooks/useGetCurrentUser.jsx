import { AuthService } from "@/api/services/auth-service"
import { useQuery } from "@tanstack/react-query"

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: AuthService.getCurrentUser
    })
}