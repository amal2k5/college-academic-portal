import CollegeTable from "../../components/colleges/CollegeTable";
import PageHeader from "../../components/common/PageHeader";
import { colleges } from "../../data/collegeData";

function Colleges() {
  return (
    <div>
      <PageHeader
        title="Colleges"
        buttonText="Add College"
      />

      <CollegeTable colleges={colleges} />
    </div>
  );
}

export default Colleges;