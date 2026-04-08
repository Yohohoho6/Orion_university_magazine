import { axiosInstance } from "../axios-instance";

export const NotificationService = {
  getNotifications: async (page = 1) => {
    return (await axiosInstance.get("/notifications", { params: { page } }))
      .data;
  },

  getUnreadCount: async () => {
    return (await axiosInstance.get("/notifications/unread-count")).data
  },

  markAllAsRead: async () => {
    return (await axiosInstance.patch("/notifications/mark-all-read")).data
  },

  markAsRead: async (id) => {
    return (await axiosInstance.patch(`/notifications/${id}/read`)).data
  },

  deleteNotification: async (id) => {
    return (await axiosInstance.delete(`/notifications/${id}`)).data
  },

  deleteNotifications: async(ids) => {
    return (await axiosInstance.delete(`/notifications/bulk-delete`, { data: { ids } })).data
  }
};
