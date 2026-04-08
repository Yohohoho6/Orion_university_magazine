import { axiosInstance } from "@/api/axios-instance"
import { useQuery } from "@tanstack/react-query"

export const useGetDashboardData = () => {
    return useQuery({
        queryKey: ['admin-dashboard-data'],
        queryFn: async() => {
            return (await axiosInstance.get("/admin/report")).data
        }
    })
}