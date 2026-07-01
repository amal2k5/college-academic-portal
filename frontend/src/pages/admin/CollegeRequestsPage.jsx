import { useEffect, useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
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
  
  // Pagination state (kept for future implementation)
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getCollegeRequests();
      setRequests(data.results || []);
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
    <div className="space-y-6">
      {/* Premium Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-800/50 pb-6">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Registration Requests
          </h1>
          <p className="mt-1 text-sm text-neutral-500 leading-relaxed max-w-xl">
            Review incoming college applications and manage platform access permissions.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search colleges or contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-neutral-900/50 border border-neutral-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 focus:bg-neutral-900 outline-none transition-all"
            />
          </div>
          
          <button className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all shrink-0">
            <Filter className="w-4 h-4" />
          </button>
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