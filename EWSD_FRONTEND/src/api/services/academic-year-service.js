import { axiosInstance } from "../axios-instance"

export const AcademicYearService = {
    getAcademicYears: async (page = 1) => {
        return (await axiosInstance.get("/academic-years", { params: { page } })).data
    },
    createAcademicYear: async (payload) => {
        return (await axiosInstance.post("/academic-years", payload)).data
    },
    updateAcademicYear: async (id, payload) => {
        return (await axiosInstance.put(`/academic-years/${id}`, payload)).data
    },
    updateAcademicYearStatus: async (id, isActive) => {
        return (await axiosInstance.patch(`/academic-years/${id}/status`, {
            is_active: isActive,
        })).data
    },
}
