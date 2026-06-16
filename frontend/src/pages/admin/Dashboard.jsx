import StatCard from "../../components/common/StatCard";
import { dashboardStats } from "../../data/dashboardData";

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Colleges"
          value={dashboardStats.totalColleges}
        />

        <StatCard
          title="Total Departments"
          value={dashboardStats.totalDepartments}
        />

        <StatCard
          title="Total HODs"
          value={dashboardStats.totalHODs}
        />

        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents}
        />
      </div>
    </div>
  );
}

export default Dashboard;