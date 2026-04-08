import { useQuery } from '@tanstack/react-query'
import { ContributionService } from '@/api/services/contribution-service'

export const useContributions = (page = 1, status = null, categoryId = null, search = null) => {
    return useQuery({
        queryKey: ['contributions', page, status, categoryId, search],
        queryFn: () => ContributionService.getContributions(page, status, categoryId, search),
        staleTime: 0, // always refetch when filters/search change
        gcTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev, // keep previous data while loading (avoids flicker)
    })
}
