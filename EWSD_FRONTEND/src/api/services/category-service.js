import { axiosInstance } from "../axios-instance"

export const CategoryService = {
    getCategories: async () => {
        const response = (await axiosInstance.get("/categories")).data
        return { data: Array.isArray(response) ? response : (response?.data ?? []) }
    },
}
