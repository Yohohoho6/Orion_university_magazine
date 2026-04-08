import { NotificationService } from "@/api/services/notification-service"
import { useQuery } from "@tanstack/react-query"

export const useGetNotifications = (page= 1) => {
    return useQuery({
        queryKey: ["notifications", page],
        queryFn: () => NotificationService.getNotifications(page),
        retry: 1,
        refetchOnWindowFocus: false,
        throwOnError: false
    })
}