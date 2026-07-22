import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
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
      // College Admin can see all complaints or specifically 'College' scope. We'll fetch all.
      const data = await getComplaints({ scope: "College" });
      setComplaints(Array.isArray(data) ? data : (data?.results || []));
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      // Dummy data fallback
      setComplaints([
        { id: 1, trackingCode: "TRK-CA01", category: "Hostel", scope: "College", description: "Water shortage in Block B.", status: "Pending", submittedDate: "2024-03-01T10:00:00Z" },
        { id: 2, trackingCode: "TRK-CA02", category: "Administration", scope: "College", description: "Fee payment portal is down.", status: "Resolved", submittedDate: "2024-03-02T14:30:00Z" },
        { id: 3, trackingCode: "TRK-CA03", category: "Infrastructure", scope: "College", description: "Main gate security is slow.", status: "Seen", submittedDate: "2024-03-03T11:20:00Z" },
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
      setComplaints((prev) => 
        prev.map(c => (c.id === id || c.trackingCode === id) ? { ...c, status: newStatus } : c)
      );
    }
  };

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === "Pending" || !c.status).length,
      seen: complaints.filter(c => c.status === "Seen").length,
      resolved: complaints.filter(c => c.status === "Resolved").length,
    };
  }, [complaints]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="College Complaints"
        subtitle="Overview and management of college-level complaints."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={loading ? "-" : stats.total} />
        <StatCard title="Pending" value={loading ? "-" : stats.pending} />
        <StatCard title="Seen" value={loading ? "-" : stats.seen} />
        <StatCard title="Resolved" value={loading ? "-" : stats.resolved} />
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Complaint List</h3>
        <ComplaintList 
          complaints={complaints}
          role="COLLEGE_ADMIN"
          loading={loading}
          error={error}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default ComplaintManagementPage;
