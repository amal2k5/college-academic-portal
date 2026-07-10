import axiosInstance from "./axiosInstance";

const assignmentService = {
  async getAssignments(params = {}) {
    const { data } = await axiosInstance.get("/assignments/", {
      params,
    });

    return data;
  },

  async getAssignment(id) {
    const { data } = await axiosInstance.get(`/assignments/${id}/`);

    return data;
  },

  async createAssignment(assignmentData) {
    const formData = new FormData();

    formData.append("title", assignmentData.title);
    formData.append("subject", assignmentData.subject);
    formData.append("description", assignmentData.description);
    formData.append("target_year", assignmentData.target_year);
    formData.append("deadline", assignmentData.deadline);
    formData.append("max_marks", assignmentData.max_marks);

    if (assignmentData.attachment instanceof File) {
      formData.append("attachment", assignmentData.attachment);
    }

    const { data } = await axiosInstance.post(
      "/assignments/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  async updateAssignment(id, assignmentData) {
    const formData = new FormData();

    if (assignmentData.title)
      formData.append("title", assignmentData.title);

    if (assignmentData.subject)
      formData.append("subject", assignmentData.subject);

    if (assignmentData.description)
      formData.append("description", assignmentData.description);

    if (assignmentData.target_year)
      formData.append("target_year", assignmentData.target_year);

    if (assignmentData.deadline)
      formData.append("deadline", assignmentData.deadline);

    if (assignmentData.max_marks)
      formData.append("max_marks", assignmentData.max_marks);

    if (assignmentData.attachment instanceof File) {
      formData.append("attachment", assignmentData.attachment);
    }

    const { data } = await axiosInstance.put(
      `/assignments/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  async deleteAssignment(id) {
    await axiosInstance.delete(`/assignments/${id}/`);
    return true;
  },
};

export default assignmentService;