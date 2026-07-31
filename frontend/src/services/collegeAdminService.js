import axiosInstance from "./axiosInstance";

export const createCollegeAdmin = async (payload) => {
  const { data } = await axiosInstance.post(
    "/auth/college-admin/create/",
    payload
  );

  return data;
};

export const getCollegeAdmins =
  async () => {
    const { data } =
      await axiosInstance.get(
        "/auth/college-admins/"
      );

    return data;
  };


export const updateCollegeAdminStatus = async (id, is_active) => {
  const { data } = await axiosInstance.patch(
    `/auth/college-admins/${id}/status/`,
    {
      is_active,
    }
  );

  return data;
};

export const getCollegeAdminDashboardStats = async () => {
  const { data } = await axiosInstance.get(
    "/auth/college-admin/dashboard/stats/"
  );
  return data;
};