import axiosInstance from "./axiosInstance";

const notificationService = {
  async getNotifications() {
    const { data } = await axiosInstance.get("/notifications/");
    return data;
  },

  async getUnreadCount() {
    const { data } = await axiosInstance.get("/notifications/unread-count/");
    return data.unread_count;
  },

  async markAllAsRead() {
    const { data } = await axiosInstance.post("/notifications/mark-all-read/", {});
    return data;
  },
};

export default notificationService;

