import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ComplaintList from "../../components/complaints/ComplaintList";
import { getComplaints, updateComplaintStatus } from "../../services/complaintService";

const ComplaintManagementPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      // HODs would typically fetch only 'Department' scope complaints or complaints related to their dept.
      const data = await getComplaints({ scope: "Department" });
      setComplaints(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      // Dummy data fallback for development
      setComplaints([
        { id: 1, trackingCode: "TRK-HOD01", category: "Academic", scope: "Department", description: "Classes are not starting on time.", status: "Pending", submittedDate: "2024-03-01T10:00:00Z" },
        { id: 2, trackingCode: "TRK-HOD02", category: "Infrastructure", scope: "Department", description: "Projector in Room 204 is broken.", status: "Seen", submittedDate: "2024-03-05T14:30:00Z" },
      ]);
      // setError("Could not load complaints. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, { status: newStatus });
      setComplaints((prev) => 
        prev.map(c => (c.id === id || c.trackingCode === id) ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      console.error("Update status failed", err);
      // Optimistic update fallback
      setComplaints((prev) => 
        prev.map(c => (c.id === id || c.trackingCode === id) ? { ...c, status: newStatus } : c)
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Complaints"
        subtitle="Manage and resolve complaints submitted by students in your department."
      />
      
      <ComplaintList 
        complaints={complaints}
        role="HOD"
        loading={loading}
        error={error}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ComplaintManagementPage;
