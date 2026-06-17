import axiosInstance from "./axiosInstance";

const DEPARTMENT_URL = "/departments/";

export const getDepartments = async () => {
  const { data } = await axiosInstance.get(DEPARTMENT_URL);
  return data;
};

export const createDepartment = async (departmentData) => {
  const { data } = await axiosInstance.post(
    DEPARTMENT_URL,
    departmentData
  );
  return data;
};

export const updateDepartment = async (id, departmentData) => {
  const { data } = await axiosInstance.put(
    `${DEPARTMENT_URL}${id}/`,
    departmentData
  );
  return data;
};

export const deleteDepartment = async (id) => {
  await axiosInstance.delete(`${DEPARTMENT_URL}${id}/`);
};