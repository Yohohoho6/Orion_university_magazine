import { axiosInstance } from "../axios-instance"

export const ContactService = {
  store: async (payload) => {
    return (await axiosInstance.post("/contact", payload)).data
  },

  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.search) {
      queryParams.append('search', params.search)
    }
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status)
    }
    const queryString = queryParams.toString()
    const url = queryString ? `/contacts?${queryString}` : '/contacts'
    return (await axiosInstance.get(url)).data
  },

  markAsRead: async (id) => {
    return (await axiosInstance.put(`/contacts/${id}/read`)).data
  }
}