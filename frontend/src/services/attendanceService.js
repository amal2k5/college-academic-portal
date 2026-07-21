import axiosInstance from "./axiosInstance";

const attendanceService = {
  async getSubjects() {
    const { data } = await axiosInstance.get("/subjects/");
    return Array.isArray(data) ? data : data.results || data.data || [];
  },

  async getClassAttendance(subjectId, date) {
    const { data } = await axiosInstance.get(`/attendance/class/?subject=${subjectId}&date=${date}`);
    return Array.isArray(data) ? data : data.results || data.attendance || data.data || [];
  },

  async saveBulkAttendance(payload) {
    const { data } = await axiosInstance.post("/attendance/bulk/", payload);
    return data;
  },

  async getStudentAttendance() {
    const { data } = await axiosInstance.get("/student/attendance/");
    return Array.isArray(data) ? data : data.results || data.data || [];
  },
};

export default attendanceService;
