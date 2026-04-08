import { NotificationService } from "@/api/services/notification-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useBulkDeleteNotifications = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: NotificationService.deleteNotifications,
        onSuccess: async() => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
            ])
        }
    })
}