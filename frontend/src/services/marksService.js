import axiosInstance from "./axiosInstance";

const marksService = {
  /**
   * Get all subjects for the HOD's department.
   * GET /subjects/
   */
  async getSubjects() {
    const { data } = await axiosInstance.get("/subjects/");
    return Array.isArray(data) ? data : data.results || data.data || [];
  },

  /**
   * Get all exams for the HOD's department.
   * GET /exams/
   */
  async getExams(params = {}) {
    const { data } = await axiosInstance.get("/exams/", { params });
    return Array.isArray(data) ? data : data.results || data.data || [];
  },

  /**
   * Get marks for a specific exam (bulk view).
   * GET /marks/bulk/?exam={examId}
   */
  async getExamMarks(examId) {
    const { data } = await axiosInstance.get(`/marks/bulk/?exam=${examId}`);
    return Array.isArray(data) ? data : data.results || data.marks || data.data || [];
  },

  /**
   * Save marks as draft for an exam.
   * POST /marks/bulk/
   * @param {number} examId - The exam PK
   * @param {Array<{student: number, marks: number}>} marks - Student marks entries
   */
  async saveDraft(examId, marks) {
    const { data } = await axiosInstance.post("/marks/bulk/", {
      exam: examId,
      marks,
    });
    return data;
  },

  /**
   * Publish all draft marks for an exam.
   * POST /marks/publish/
   * @param {number} examId - The exam PK
   */
  async publishMarks(examId) {
    const { data } = await axiosInstance.post("/marks/publish/", {
      exam: examId,
    });
    return data;
  },

  /**
   * Get published marks for the logged-in student.
   * GET /student/marks/
   */
  async getStudentMarks() {
    const { data } = await axiosInstance.get("/student/marks/");
    return Array.isArray(data) ? data : data.results || data.data || [];
  },
};

export default marksService;
