import { commentService } from "@/api/services/comment-service"
import { useQuery } from "@tanstack/react-query"

export const useComments = (contributionId) => {
    return useQuery({
        queryKey: ["contribution-comments", contributionId],
        queryFn: () => commentService.getContributionComments(contributionId),
        enabled: !!contributionId
    })
}