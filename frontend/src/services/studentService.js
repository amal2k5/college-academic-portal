import { students } from "../mocks/students";




export const getStudents = () => {
  return students;
};


export const getStudentById = async (id) => {
  return students.find(
    (student) => student.id === Number(id)
  );
};


export const deleteStudent = async (id) => {
  console.log("Deleting student:", id);

  return {
    message: "Student deleted successfully",
  };
};