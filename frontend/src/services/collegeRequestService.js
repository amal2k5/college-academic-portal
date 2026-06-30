import axiosInstance from "./axiosInstance";

export const submitCollegeRequest = async (data) => {
  const response = await axiosInstance.post("/college-requests/", data);
  return response.data;
};

export const getCollegeRequests = async (params = {}) => {
  const response = await axiosInstance.get(
    "/college-requests/list/",
    { params }
  );

  return response.data;
};

export const getCollegeRequest = async (id) => {
  const response = await axiosInstance.get(
    `/college-requests/${id}/`
  );

  return response.data;
};

export const approveCollegeRequest = async (id) => {
  const response = await axiosInstance.patch(
    `/college-requests/${id}/approve/`
  );

  return response.data;
};

export const rejectCollegeRequest = async (
  id,
  reason
) => {
  const response = await axiosInstance.patch(
    `/college-requests/${id}/reject/`,
    { reason }
  );

  return response.data;
};