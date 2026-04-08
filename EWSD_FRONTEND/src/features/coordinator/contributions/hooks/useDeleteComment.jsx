import { commentService } from "@/api/services/comment-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: commentService.deleteComment,
        onSuccess: () => {
            toast.success("Comment deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['contribution-comments'] })
        }
    })
}