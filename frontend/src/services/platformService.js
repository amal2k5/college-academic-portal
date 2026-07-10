import axiosInstance from "./axiosInstance";

const PLATFORM_URL = "/auth/platform";

export const getPlatformDashboardStats = async () => {
  const { data } = await axiosInstance.get(`${PLATFORM_URL}/dashboard/stats/`);
  return data;
};
