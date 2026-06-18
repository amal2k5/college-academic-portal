import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const response = await axiosInstance.post(
    "/auth/login/",
    {
      email,
      password,
    }
  );

  return response.data;
};

export const logout = async (refresh) => {
  const response = await axiosInstance.post(
    "/auth/logout/",
    {
      refresh,
    }
  );

  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await axiosInstance.post(
    "/auth/refresh/",
    {
      refresh,
    }
  );

  return response.data;
};