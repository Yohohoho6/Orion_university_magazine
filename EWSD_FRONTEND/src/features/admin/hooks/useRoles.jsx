import { RoleService } from '@/api/services/role-service'
import { useQuery } from '@tanstack/react-query'

export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: RoleService.getRoles
    })
}