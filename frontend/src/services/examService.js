import axiosInstance from "./axiosInstance";

const examService = {
  /**
   * Get all exams.
   * GET /api/exams/
   * @param {Object} params - Query parameters (e.g., filters)
   */
  async getExams(params = {}) {
    const { data } = await axiosInstance.get("/exams/", { params });
    return data;
  },

  /**
   * Get a specific exam by ID.
   * GET /api/exams/:id/
   * @param {number|string} id - The exam ID
   */
  async getExam(id) {
    const { data } = await axiosInstance.get(`/exams/${id}/`);
    return data;
  },

  /**
   * Create a new exam.
   * POST /api/exams/
   * @param {Object} examData - The exam payload
   */
  async createExam(examData) {
    const { data } = await axiosInstance.post("/exams/", examData);
    return data;
  },

  /**
   * Update an existing exam.
   * PUT /api/exams/:id/
   * @param {number|string} id - The exam ID
   * @param {Object} examData - The exam payload
   */
  async updateExam(id, examData) {
    const { data } = await axiosInstance.put(`/exams/${id}/`, examData);
    return data;
  },

  /**
   * Cancel (delete) an exam.
   * DELETE /api/exams/:id/
   * @param {number|string} id - The exam ID
   */
  async cancelExam(id) {
    const { data } = await axiosInstance.delete(`/exams/${id}/`);
    return data;
  },

  /**
   * Delete an exam (alias to cancelExam for backward compatibility in components).
   * @param {number|string} id - The exam ID
   */
  async deleteExam(id) {
    return this.cancelExam(id);
  }
};

export default examService;
