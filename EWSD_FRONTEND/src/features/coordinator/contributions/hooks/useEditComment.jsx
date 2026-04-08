import { commentService } from "@/api/services/comment-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useEditComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ commentId, content }) => commentService.editComment(commentId, content),
        onSuccess: () => {
            toast.success("Comment edited successfully");
            queryClient.invalidateQueries({ queryKey: ['contribution-comments'] })
        }
    })
}