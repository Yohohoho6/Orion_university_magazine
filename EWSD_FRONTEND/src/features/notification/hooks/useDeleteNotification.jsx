import { NotificationService } from "@/api/services/notification-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteNotification = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: NotificationService.deleteNotification,
        onSuccess: async() => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
            ])
        },
        onError: (error) => {
            console.error("Failed to delete notification:", error);
        }
    })
}