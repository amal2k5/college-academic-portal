import axiosInstance from "./axiosInstance";

// Student: Submit a new complaint
export const submitComplaint = async (complaintData) => {
  const response = await axiosInstance.post("/complaints/submit/", complaintData);
  return response.data;
};

// Student: Track a complaint by tracking code
export const trackComplaint = async (trackingCode) => {
  const response = await axiosInstance.get(`/complaints/track/${trackingCode}/`);
  return response.data;
};

// HOD & Admin: Get all complaints (with optional filters)
export const getComplaints = async (params = {}) => {
  const response = await axiosInstance.get("/complaints/", { params });
  return response.data;
};

// HOD & Admin: Update complaint status
export const updateComplaintStatus = async (id, statusData) => {
  const response = await axiosInstance.put(`/complaints/${id}/status/`, statusData);
  return response.data;
};

// Admin: Get overall complaint statistics
export const getComplaintStats = async () => {
  const response = await axiosInstance.get("/complaints/stats/");
  return response.data;
};
