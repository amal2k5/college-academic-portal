import axiosInstance from "./axiosInstance";

const subjectService = {
  /**
   * Get all subjects for the HOD's department.
   * GET /subjects/
   */
  async getSubjects() {
    const { data } = await axiosInstance.get("/subjects/");
    return Array.isArray(data) ? data : data.results || data.data || [];
  },

  /**
   * Create a new subject.
   * POST /subjects/
   * Department is auto-assigned by the backend.
   */
  async createSubject(subjectData) {
    const { data } = await axiosInstance.post("/subjects/", subjectData);
    return data;
  },

  /**
   * Update an existing subject (partial update via PUT).
   * PUT /subjects/:id/
   */
  async updateSubject(id, subjectData) {
    const { data } = await axiosInstance.put(`/subjects/${id}/`, subjectData);
    return data;
  },

  /**
   * Delete a subject.
   * DELETE /subjects/:id/
   */
  async deleteSubject(id) {
    await axiosInstance.delete(`/subjects/${id}/`);
    return true;
  },
};

export default subjectService;
