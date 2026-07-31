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
import PageHeader from "../../components/common/PageHeader";

const CollegeRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loadingCollegeId, setLoadingCollegeId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // "approve" | "reject" | null
  
  // Pagination state (kept for future implementation)
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchRequests = async (signal) => {
    try {
      setLoading(true);
      const data = await getCollegeRequests();
      if (signal?.aborted) return;
      setRequests(data.results || []);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (error) {
      if (signal?.aborted) return;
      console.error(error);
      toast.error("Failed to load registration requests.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchRequests(controller.signal);
    
    const handleRefetch = () => fetchRequests();
    window.addEventListener("refetchCollegeRequests", handleRefetch);
    
    return () => {
      controller.abort();
      window.removeEventListener("refetchCollegeRequests", handleRefetch);
    };
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
    if (!selectedRequest || loadingAction) return;
    
    setLoadingCollegeId(selectedRequest.id);
    setLoadingAction("approve");
    
    try {
      await approveCollegeRequest(selectedRequest.id);
      toast.success("College request approved successfully.");
      setDetailsOpen(false);
      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to approve request.",
      );
    } finally {
      setLoadingCollegeId(null);
      setLoadingAction(null);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedRequest || loadingAction) return;
    
    setLoadingCollegeId(selectedRequest.id);
    setLoadingAction("reject");
    
    try {
      await rejectCollegeRequest(selectedRequest.id, reason);
      toast.success("College request rejected.");
      setRejectOpen(false);
      fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to reject request.",
      );
    } finally {
      setLoadingCollegeId(null);
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Premium Page Header */}
      <PageHeader
        title="Registration Requests"
        subtitle="Review incoming college applications and manage platform access permissions."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-600 py-2 pl-9 pr-4 text-xs text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700/50 outline-none transition-all"
            />
          </div>
        }
      />

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
        isApproving={loadingCollegeId === selectedRequest?.id && loadingAction === "approve"}
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