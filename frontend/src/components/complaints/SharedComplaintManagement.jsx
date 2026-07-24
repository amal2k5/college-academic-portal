import React, { useEffect, useState, useCallback, useRef } from "react";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";
import { updateComplaintStatus } from "../../services/complaintService";
import { Search, Filter, Loader2, Inbox, AlertCircle } from "lucide-react";
import ComplaintTable from "./ComplaintTable";
import ComplaintDetailModal from "./ComplaintDetailModal";
import { toast } from "react-toastify";

const COMPLAINT_CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Faculty", value: "FACULTY" },
  { label: "Facilities", value: "FACILITIES" },
  { label: "Discipline", value: "DISCIPLINE" },
  { label: "Examination", value: "EXAMINATION" },
  { label: "Other", value: "OTHER" },
];

const COMPLAINT_STATUSES = ["All", "Submitted", "Seen", "Resolved"];
const COMPLAINT_SCOPES = ["All", "Department", "College"];

const SharedComplaintManagement = ({ 
  title, 
  subtitle, 
  fetchComplaintsApi, 
  dashboardApi, 
  showScopeFilter = false 
}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard stats
  const [stats, setStats] = useState({ total: 0, submitted: 0, seen: 0, resolved: 0 });
  const [loadingStats, setLoadingStats] = useState(!!dashboardApi);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [scopeFilter, setScopeFilter] = useState("All");
  const [ordering, setOrdering] = useState("-created_at");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const searchTimeout = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400); // 400ms debounce
    return () => clearTimeout(searchTimeout.current);
  }, [searchInput]);

  const fetchDashboardStats = useCallback(async () => {
    if (!dashboardApi) return;
    setLoadingStats(true);
    try {
      const data = await dashboardApi();
      setStats({
        total: data.total || 0,
        submitted: data.submitted || 0,
        seen: data.seen || 0,
        resolved: data.resolved || 0,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, [dashboardApi]);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page,
        ordering: ordering,
      };
      
      if (searchTerm) params.tracking_code = searchTerm;
      if (categoryFilter !== "All") params.category = categoryFilter;
      if (statusFilter !== "All") params.status = statusFilter.toUpperCase();
      if (showScopeFilter && scopeFilter !== "All") params.scope = scopeFilter.toUpperCase();

      const data = await fetchComplaintsApi(params);
      setComplaints(data.results || []);
      
      if (!dashboardApi) {
        setStats(prev => ({ ...prev, total: data.count || 0 }));
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError(
        err.response?.data?.detail || 
        "Could not load complaints. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, categoryFilter, statusFilter, scopeFilter, ordering, fetchComplaintsApi, dashboardApi, showScopeFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, statusFilter, scopeFilter, ordering]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleUpdateStatus = async (id, newStatus, resolutionNote = "") => {
    setIsUpdating(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === "RESOLVED") {
        payload.resolution_note = resolutionNote;
      }
      await updateComplaintStatus(id, payload);
      toast.success("Complaint status updated successfully.");
      
      setSelectedComplaint(null);
      // Fetch concurrently to reduce UI waiting time
      await Promise.all([fetchComplaints(), fetchDashboardStats()]);
    } catch (err) {
      console.error("Update status failed", err);
      toast.error(
        err.response?.data?.detail || 
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to update status."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextPage = () => {
    if (page * 20 < stats.total) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
      />
      
      {/* Summary Section */}
      {dashboardApi ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Complaints" value={loadingStats ? "-" : stats.total} />
          <StatCard title="Submitted" value={loadingStats ? "-" : stats.submitted} />
          <StatCard title="Seen" value={loadingStats ? "-" : stats.seen} />
          <StatCard title="Resolved" value={loadingStats ? "-" : stats.resolved} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col">
            <span className="text-sm font-medium text-neutral-400">Total Complaints</span>
            <span className="text-2xl font-semibold text-white mt-1">{stats.total}</span>
          </div>
        </div>
      )}

      {/* Toolbar / Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full lg:max-w-md flex-shrink-0">
          <label htmlFor="search-complaints" className="sr-only">Search tracking code</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            id="search-complaints"
            type="text"
            placeholder="Search tracking code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase font-mono"
          />
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto">
          {showScopeFilter && (
            <div className="relative flex-1 lg:flex-none">
              <label htmlFor="filter-scope" className="sr-only">Filter by Scope</label>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <select
                id="filter-scope"
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              >
                {COMPLAINT_SCOPES.map(scope => (
                  <option key={scope} value={scope}>{scope}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex-1 lg:flex-none">
            <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {COMPLAINT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 lg:flex-none">
            <label htmlFor="filter-status" className="sr-only">Filter by Status</label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {COMPLAINT_STATUSES.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 lg:flex-none">
            <label htmlFor="sort-ordering" className="sr-only">Sort by Date</label>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <select
              id="sort-ordering"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {error ? (
          <EmptyState 
            icon={AlertCircle} 
            title="Error Loading Data" 
            message={error} 
            className="bg-red-500/5 border-red-500/10 text-red-400"
          />
        ) : loading ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 h-64 animate-pulse flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-6 bg-neutral-800 rounded w-full"></div>
              <div className="h-6 bg-neutral-800 rounded w-full"></div>
              <div className="h-6 bg-neutral-800 rounded w-full"></div>
              <div className="h-6 bg-neutral-800 rounded w-full"></div>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState 
            icon={Inbox}
            title="No complaints found"
            message={
              searchTerm || categoryFilter !== "All" || statusFilter !== "All" || (showScopeFilter && scopeFilter !== "All")
                ? "Try adjusting your search or filters." 
                : "There are no complaints to display."
            }
          />
        ) : (
          <>
            <ComplaintTable 
              complaints={complaints}
              onView={(complaint) => setSelectedComplaint(complaint)}
            />
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
              <span className="text-sm text-neutral-400">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, stats.total)} of {stats.total} Complaints
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page * 20 >= stats.total}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => !isUpdating && setSelectedComplaint(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default SharedComplaintManagement;
