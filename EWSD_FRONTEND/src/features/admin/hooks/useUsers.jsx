import { UserService } from '@/api/services/user-service'
import { useQuery } from '@tanstack/react-query'

export const useUsers = (page = 1) => {
    return useQuery({
        queryKey: ['users', page],
        queryFn: () => UserService.getUsers(page),
    })
}