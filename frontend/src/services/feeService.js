import axiosInstance from "./axiosInstance";

// ============================================
// Student Fee Endpoints
// ============================================

/**
 * Get all fees for the logged-in student based on their department and semester
 */
export const getStudentFees = async () => {
  const { data } = await axiosInstance.get("/fees/");
  return data;
};

/**
 * Get details of a specific fee
 */
export const getFeeDetails = async (feeId) => {
  const { data } = await axiosInstance.get(`/fees/${feeId}/`);
  return data;
};

/**
 * Create a Razorpay order for a fee payment
 */
export const createPaymentOrder = async (feeId) => {
  const { data } = await axiosInstance.post("/fees/payments/create-order/", {
    fee_id: feeId,
  });
  return data;
};

/**
 * Verify a Razorpay payment after successful checkout
 */
export const verifyPayment = async (verificationData) => {
  const { data } = await axiosInstance.post("/fees/payments/verify/", verificationData);
  return data;
};

/**
 * Get the payment history of the logged-in student
 */
export const getPaymentHistory = async (params) => {
  const { data } = await axiosInstance.get("/fees/payments/history/", { params });
  return data;
};


// ============================================
// HOD Fee Endpoints
// ============================================
// Assuming standard RESTful paths for HOD based on the implementation plan.

/**
 * Get all fees created by the HOD for their department
 */
export const getHODFees = async (params) => {
  const { data } = await axiosInstance.get("/fees/hod/", { params });
  return data;
};

/**
 * Create a new fee (HOD only)
 */
export const createFee = async (feeData) => {
  const { data } = await axiosInstance.post("/fees/hod/", feeData);
  return data;
};

/**
 * Update an existing fee (HOD only)
 */
export const updateFee = async (feeId, feeData) => {
  const { data } = await axiosInstance.put(`/fees/hod/${feeId}/`, feeData);
  return data;
};

/**
 * Delete a fee (HOD only)
 */
export const deleteFee = async (feeId) => {
  const { data } = await axiosInstance.delete(`/fees/hod/${feeId}/`);
  return data;
};

/**
 * Get fee summary stats for the HOD dashboard (Paid/Unpaid)
 */
export const getFeeStats = async () => {
  const { data } = await axiosInstance.get("/fees/hod/stats/");
  return data;
};

/**
 * Send a reminder email to students who haven't paid the fee
 */
export const sendFeeReminder = async (feeId) => {
  const { data } = await axiosInstance.post(`/fees/hod/${feeId}/remind/`);
  return data;
};
