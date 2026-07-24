import React from "react";
import SharedComplaintManagement from "../../components/complaints/SharedComplaintManagement";
import { getCollegeComplaints, getComplaintDashboard } from "../../services/complaintService";

const CollegeAdminComplaintManagementPage = () => {
  return (
    <SharedComplaintManagement
      title="College Complaints"
      subtitle="Overview and management of college-level complaints."
      fetchComplaintsApi={getCollegeComplaints}
      dashboardApi={getComplaintDashboard}
      showScopeFilter={true}
    />
  );
};

export default CollegeAdminComplaintManagementPage;
