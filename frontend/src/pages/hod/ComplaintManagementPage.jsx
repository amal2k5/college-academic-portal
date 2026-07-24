import React from "react";
import SharedComplaintManagement from "../../components/complaints/SharedComplaintManagement";
import { getDepartmentComplaints } from "../../services/complaintService";

const HODComplaintManagementPage = () => {
  return (
    <SharedComplaintManagement
      title="Department Complaints"
      subtitle="Manage and resolve complaints submitted by students in your department."
      fetchComplaintsApi={getDepartmentComplaints}
      showScopeFilter={false}
    />
  );
};

export default HODComplaintManagementPage;
