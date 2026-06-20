import axiosInstance from "./axiosInstance";

const COLLEGE_URL = "/colleges/";

export const getColleges = async () => {
  const { data } = await axiosInstance.get(COLLEGE_URL);
  return data;
};

export const createCollege = async (collegeData) => {
  const { data } = await axiosInstance.post(COLLEGE_URL, collegeData);
  return data;
};

export const updateCollege = async (id, collegeData) => {
  const { data } = await axiosInstance.put(
    `${COLLEGE_URL}${id}/`,
    collegeData
  );
  return data;
};

export const deleteCollege = async (id) => {
  await axiosInstance.delete(`${COLLEGE_URL}${id}/`);
};