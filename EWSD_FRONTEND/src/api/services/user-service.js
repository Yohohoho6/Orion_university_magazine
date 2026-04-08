import { axiosInstance } from "../axios-instance"
import { toFormData } from "../../utils/helpers"

export const UserService = {
    getUsers: async (page = 1) => {
        return (await axiosInstance.get("/users", { params: { page } })).data
    },
    createUser: async (payload) => {
        return (await axiosInstance.post("/users", payload)).data
    },
    updateUser: async (id, payload) => {
        return (await axiosInstance.put(`/users/${id}`, payload)).data
    },
    updateUserStatus: async (id, status) => {
        return (await axiosInstance.patch(`/users/${id}/status`, {
            status,
            confirm_action: true,
        })).data
    },
    updatePassword: async (id, payload) => {
        return (await axiosInstance.patch(`/users/${id}/password`, payload)).data
    },
    updateProfile: async (id, payload) => {
        return (await axiosInstance.post(`/users/${id}/profile`, toFormData(payload))).data
    },
    getFacultyStudents: async (page = 1) => {
        return (await axiosInstance.get("/faculty/students", { params: { page } })).data
    },
    getFacultyGuests: async (page = 1) => {
        return (await axiosInstance.get("/faculty/guests", { params: { page } })).data
    },
    completeTour: async () => {
        return (await axiosInstance.post("/user/complete-tour")).data
    },
    
    toggle2FA: async (current_password) => {
        return (await axiosInstance.post("/user/toggle-2fa", { current_password })).data
    },
}
