import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token")
    if(accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config
})
