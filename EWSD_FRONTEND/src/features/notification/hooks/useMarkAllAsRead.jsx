import { NotificationService } from "@/api/services/notification-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: NotificationService.markAllAsRead,
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
            await queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
        onError: (error) => {
            console.error("Failed to mark all as read:", error);
        }
    })
}