import { axiosInstance } from "../axios-instance"

export const FacultyService = {
    getFaculties: async(payload) => {
        return (await axiosInstance.get("/faculties", payload)).data
    },
}