import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  getCollegeRequests,
  approveCollegeRequest,
  rejectCollegeRequest,
  getCollegeRequest,
} from "../../services/collegeRequestService";
import CollegeRequestsTable from "../../components/collegeAdmins/CollegeRequestsTable";
import RequestDetailsModal from "../../components/collegeAdmins/RequestDetailsModal";
import RejectRequestModal from "../../components/collegeAdmins/RejectRequestModal";

const CollegeRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

const fetchRequests = async () => {
  
  try {
    setLoading(true);

    const data = await getCollegeRequests();

    setRequests(data.results);
    setCount(data.count);
    setNext(data.next);
    setPrevious(data.previous);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load registration requests.");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchRequests();
  }, []);

  // Memoized filtering for performance
  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;
    const keyword = search.toLowerCase();
    return requests.filter(
      (item) =>
        item.college_name?.toLowerCase().includes(keyword) ||
        item.contact_person?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword),
    );
  }, [requests, search]);

  const handleView = async (request) => {

    try {
      const data = await getCollegeRequest(request.id);

      setSelectedRequest(data);

      setDetailsOpen(true);
    } catch {
      toast.error("Unable to load request details.");
    }
  };
  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      await approveCollegeRequest(selectedRequest.id);
      toast.success("College request approved successfully.");
      setDetailsOpen(false);
      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to approve request.",
      );
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectCollegeRequest(selectedRequest.id, reason);
      toast.success("College request rejected.");
      setRejectOpen(false);
      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to reject request.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-10">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Registration Requests
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Review incoming college applications and manage access permissions.
          </p>
        </div>

        {/* Premium Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search colleges or contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-indigo-500/50 focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Data Table */}
      <CollegeRequestsTable
        loading={loading}
        requests={filteredRequests}
        onView={handleView}
      />

      {/* Modals */}
      <RequestDetailsModal
        isOpen={detailsOpen}
        request={selectedRequest}
        onClose={() => setDetailsOpen(false)}
        onApprove={handleApprove}
        onReject={() => {
          setDetailsOpen(false);
          setRejectOpen(true);
        }}
      />

      <RejectRequestModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onSubmit={handleReject}
      />
    </div>
  );
};

export default CollegeRequestsPage;
