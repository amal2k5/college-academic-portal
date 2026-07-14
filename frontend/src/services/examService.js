import axiosInstance from "./axiosInstance";

const examService = {
  /**
   * Get all exams for the HOD's department.
   * GET /exams/
   */
  async getExams(params = {}) {
    const { data } = await axiosInstance.get("/exams/", { params });
    return Array.isArray(data) ? data : data.results || data.data || [];
  },

  /**
   * Create a new exam.
   * POST /exams/
   */
  async createExam(payload) {
    const { data } = await axiosInstance.post("/exams/", payload);
    return data;
  },

  /**
   * Update an existing exam.
   * PUT /exams/:id/
   */
  async updateExam(id, payload) {
    const { data } = await axiosInstance.put(`/exams/${id}/`, payload);
    return data;
  },

  /**
   * Delete an exam.
   * DELETE /exams/:id/
   */
  async deleteExam(id) {
    const { data } = await axiosInstance.delete(`/exams/${id}/`);
    return data;
  }
};

export default examService;
