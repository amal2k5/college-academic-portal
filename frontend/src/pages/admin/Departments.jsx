import DepartmentTable from "../../components/departments/DepartmentTable";
import PageHeader from "../../components/common/PageHeader";
import { departments } from "../../data/departmentData";

function Departments() {
  return (
    <div>
      <PageHeader
        title="Departments"
        buttonText="Add Department"
      />

      <DepartmentTable departments={departments} />
    </div>
  );
}

export default Departments;