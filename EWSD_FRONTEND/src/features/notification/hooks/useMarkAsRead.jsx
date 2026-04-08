import { NotificationService } from "@/api/services/notification-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMarkAsRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: NotificationService.markAsRead,
        onSuccess: async() => {
            await Promise.all[[
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
            ]]
        },
        onError: (error) => {
            console.error("Failed to mark as read:", error);
        }
    })
}