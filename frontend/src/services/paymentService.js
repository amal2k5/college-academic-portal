import axiosInstance from "./axiosInstance";

export const paymentService = {
  createOrder: async (feeId) => {
    const response = await axiosInstance.post("/fees/payments/create-order/", {
      fee_id: feeId,
    });
    return response.data;
  },

  verifyPayment: async (payload) => {
    const response = await axiosInstance.post(
      "/fees/payments/verify/",
      payload
    );
    return response.data;
  },
};
