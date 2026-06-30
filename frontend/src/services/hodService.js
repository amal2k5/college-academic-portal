import axiosInstance from "./axiosInstance";

/**
 * Create a new HOD
 */
export const createHOD = async (payload) => {
  const { data } = await axiosInstance.post("/auth/hod/create/", payload);
  return data;
};

/**
 * Get all HODs for the logged-in College Admin's college
 */
export const getHODs = async () => {
  const { data } = await axiosInstance.get("/auth/hods/");
  return data;
};

/**
 * Get details of a specific HOD
 */
export const getHODDetails = async (id) => {
  const { data } = await axiosInstance.get(`/auth/hods/${id}/`);
  return data;
};

/**
 * Update HOD status (Activate/Deactivate)
 * Payload must be an object: { is_active: true/false }
 */
export const updateHODStatus = async (id, isActive) => {
  const { data } = await axiosInstance.patch(`/auth/hods/${id}/status/`, {
    is_active: isActive,
  });
  return data;
};

/**
 * Get Dashboard Stats (Note: Check if this endpoint is correct for HODs)
 * Currently points to students/dashboard/stats/
 */
export const getHODDashboardStats = async () => {
  const { data } = await axiosInstance.get("students/dashboard/stats/");
  return data;
};