import React from "react";
import PageHeader from "../../components/common/PageHeader";
import ComplaintForm from "../../components/complaints/ComplaintForm";

const ComplaintSubmissionPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Complaint"
        subtitle="Report an issue or grievance to the college or your department."
      />
      <div className="py-4">
        <ComplaintForm />
      </div>
    </div>
  );
};

export default ComplaintSubmissionPage;
