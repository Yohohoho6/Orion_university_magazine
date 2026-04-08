import { axiosInstance } from "../axios-instance"

export const RoleService = {
    getRoles: async () => {
        return (await axiosInstance.get("/roles")).data
    }
}