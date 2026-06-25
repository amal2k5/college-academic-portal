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

// GET /api/students/profile/
export const getStudentProfile = async () => {
  try {
    const response = await axiosInstance.get("/students/profile/");
    console.log("Profile API response:", response.data);
    
    // If the response has a data property, return that
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // If the response is directly the student object
    if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    
    // If the response has a results array (like list endpoints)
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results[0] || {};
    }
    
    // Fallback: return whatever we got
    return response.data || {};
  } catch (error) {
    console.error("Error fetching student profile:", error);
    // Return empty object instead of throwing to prevent UI crash
    return {};
  }
};

// GET /api/students/dashboard/stats/
export const getStudentDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/students/dashboard/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalStudents: 0,
      averageAttendance: "0%",
      activeAssignments: 0,
      pendingLeaves: 0
    };
  }
};