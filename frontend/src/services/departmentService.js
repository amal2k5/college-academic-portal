import axiosInstance from "./axiosInstance";

const DEPARTMENT_URL = "/departments/";

/**
 * Get all departments (Platform Admin) or My Departments (College Admin)
 * Depending on your backend logic, you might want to use getMyDepartments() 
 * specifically for the College Admin view.
 */
export const getDepartments = async () => {
  const { data } = await axiosInstance.get(DEPARTMENT_URL);
  return data;
};

/**
 * Get departments specifically for the logged-in College Admin's college
 */
export const getMyDepartments = async () => {
  const { data } = await axiosInstance.get("/departments/my-departments/");
  return data;
};

/**
 * Create a new department
 */
export const createDepartment = async (departmentData) => {
  const { data } = await axiosInstance.post(DEPARTMENT_URL, departmentData);
  return data;
};

/**
 * Update department details (Name, Code, etc.)
 */
export const updateDepartment = async (id, departmentData) => {
  const { data } = await axiosInstance.put(
    `${DEPARTMENT_URL}${id}/`,
    departmentData
  );
  return data;
};

/**
 * Get details of a specific department
 */
export const getDepartmentDetails = async (id) => {
    const { data } = await axiosInstance.get(
        `/departments/${id}/details/`
    );

    return data;
};
/**
 * Update department status (Activate/Deactivate)
 * Payload: { is_active: boolean }
 */
export const updateDepartmentStatus = async (id, isActive) => {
  const { data } = await axiosInstance.patch(
    `${DEPARTMENT_URL}${id}/status/`,
    { is_active: isActive }
  );
  return data;
};

/**
 * Legacy delete function (if still needed for hard delete scenarios)
 * Note: Prefer updateDepartmentStatus for soft deletes.
 */
export const deleteDepartment = async (id) => {
  await axiosInstance.delete(`${DEPARTMENT_URL}${id}/`);
};