import axiosInstance from "./axiosInstance";

export const createComplaint = async (formData) => {
  const response = await axiosInstance.post("/complaints/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const trackComplaint = async (trackingCode) => {
  const response = await axiosInstance.get(`/complaints/track/?tracking_code=${trackingCode}`);
  return response.data;
};

export const getDepartmentComplaints = async (params = {}) => {
  const response = await axiosInstance.get("/complaints/department/", { params });
  return response.data;
};

export const getCollegeComplaints = async (params = {}) => {
  const response = await axiosInstance.get("/complaints/college/", { params });
  return response.data;
};

export const getComplaintDashboard = async () => {
  const response = await axiosInstance.get("/complaints/dashboard/");
  return response.data;
};

export const updateComplaintStatus = async (id, data) => {
  const response = await axiosInstance.patch(`/complaints/${id}/status/`, data);
  return response.data;
};
