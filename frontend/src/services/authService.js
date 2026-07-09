import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login/", { email, password });
  return response.data;
};

export const logout = async (refresh) => {
  const response = await axiosInstance.post("/auth/logout/", { refresh });
  return response.data;
};


export const refreshToken = async (refresh) => {
  const response = await axiosInstance.post("/auth/refresh/", { refresh });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password/", { email });
  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await axiosInstance.post("/auth/verify-otp/", { email, otp });
  return response.data;
};

export const resetPassword = async (resetToken, password, confirmPassword) => {
  const response = await axiosInstance.post("/auth/reset-password/", {
    reset_token: resetToken,
    password,
    confirm_password: confirmPassword,
  });
  return response.data;
};