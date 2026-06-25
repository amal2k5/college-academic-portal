import axiosInstance from "./axiosInstance";

// GET /api/students/
export const getStudents = async () => {
  const response = await axiosInstance.get("/students/");

  if (Array.isArray(response.data)) {
    return response.data;
  }
  

  if (response.data && response.data.results) {
    return response.data.results;
  }
  

  if (response.data && response.data.data) {
    return response.data.data;
  }
  
  
  console.warn("Unexpected API response format:", response.data);
  return [];
};

// GET /api/students/{id}/
export const getStudentById = async (id) => {
  const response = await axiosInstance.get(`/students/${id}/`);
  return response.data;
};

// POST /api/students/create/
export const createStudent = async (studentData) => {
  const response = await axiosInstance.post("/students/create/", studentData);
  return response.data;
};

// PUT /api/students/{id}/update/
export const updateStudent = async (id, studentData) => {
  const response = await axiosInstance.put(`/students/${id}/update/`, studentData);
  return response.data;
};

// DELETE /api/students/{id}/delete/
export const deleteStudent = async (id) => {
  const response = await axiosInstance.delete(`/students/${id}/delete/`);
  return response.data;
};