import { axiosInstance } from "@/api/axios-instance"
import { useQuery } from "@tanstack/react-query"

export const useGetDashboardData = () => {
    return useQuery({
        queryKey: ['manager-dashboard-data'],
        queryFn: async() => {
            return (await axiosInstance.get("/manager/dashboard")).data
        }
    })
}