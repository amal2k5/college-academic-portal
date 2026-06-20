import axiosInstance from "./axiosInstance";

export const createHOD = async (payload) => {
  const { data } = await axiosInstance.post(
    "/auth/hod/create/",
    payload
  );

  return data;
};

export const getHODs = async () => {
  const { data } = await axiosInstance.get(
    "/auth/hods/"
  );

  return data;
};