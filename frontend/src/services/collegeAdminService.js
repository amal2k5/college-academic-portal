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