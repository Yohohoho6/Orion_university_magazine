import { commentService } from "@/api/services/comment-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify";

export const useCreateComment = (contributionId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment) => commentService.addComment(contributionId, comment.content, comment.parentId || null),
        onSuccess: () => {
            toast.success("Comment added successfully");
            queryClient.invalidateQueries({ queryKey: ['contribution-comments'] })
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to add comment");
        }
    })
}