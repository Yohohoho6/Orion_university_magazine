import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ContributionService } from '@/api/services/contribution-service'

export const useSelectContributions = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ids, action }) => ContributionService.selectContributions(ids, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contributions'] })
        },
    })
}
