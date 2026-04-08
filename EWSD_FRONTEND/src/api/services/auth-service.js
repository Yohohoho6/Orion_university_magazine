import { axiosInstance } from "../axios-instance"

export const AuthService = {
    login: async(payload) => {
        return (await axiosInstance.post("/login", payload)).data
    },

    register: async(payload) => {
        return (await axiosInstance.post("/register", payload)).data
    },

    logout: async() => {
        return (await axiosInstance.post("/logout")).data
    },

    getCurrentUser: async() => {
        return (await axiosInstance.get("/user")).data
    },

    verfiy2FA: async(payload) => {
        return (await axiosInstance.post("/login/verify", payload)).data
    },

    resendOTP: async(email) => {
        return (await axiosInstance.post("/login/resend", {email})).data
    },

    forgotPassword: async(email) => {
        return (await axiosInstance.post("/forgot-password", { email })).data
    },

    verifyPasswordCode: async (payload) => {
        return (await axiosInstance.post("/forgot-password/verify", payload)).data
    },

    resetPassword: async (payload) => {
        return await axiosInstance.post("/forgot-password/reset", payload)
    }
}