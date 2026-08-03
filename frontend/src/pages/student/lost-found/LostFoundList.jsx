import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import {
  Search, Plus, MapPin, Calendar, User, Package, Eye, X
} from "lucide-react";
import { format, isValid } from "date-fns";
import { LoadingSkeleton } from "../../../components/common/loading";
import PageHeader from "../../../components/common/PageHeader";

const STATUS_CONFIG = {
  LOST: { label: "Lost", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" },
  FOUND: { label: "Found", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  CLAIMED: { label: "Claimed", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  RETURNED: { label: "Returned", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  RESOLVED: { label: "Resolved", color: "text-neutral-400", border: "border-neutral-600", bg: "bg-neutral-800/40" },
};

function Skeleton() {
  return (
    <div className="p-4 flex items-center justify-between gap-4 border-b border-neutral-800/60 last:border-b-0 bg-neutral-900/20">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <LoadingSkeleton width="w-12" height="h-12" rounded="rounded-lg" />
        <div className="space-y-2 flex-1 max-w-xl">
          <LoadingSkeleton width="w-1/3" height="h-4" rounded="rounded" />
          <LoadingSkeleton width="w-3/4" height="h-3" rounded="rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <LoadingSkeleton width="w-16" height="h-6" rounded="rounded-md" />
        <LoadingSkeleton width="w-16" height="h-7" rounded="rounded-lg" />
      </div>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.LOST;
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${cfg.bg} ${cfg.color} ${cfg.border} ${sizeClasses}`}>
      {cfg.label}
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-800/60 text-neutral-300 border border-neutral-700/60">
      {category || "Other"}
    </span>
  );
}

function PostCard({ post, index }) {
  const postDate = new Date(post.created_at);
  const dateText = isValid(postDate) ? format(postDate, "MMM d, yyyy") : "Recent";

  return (
    <div className="group hover:bg-neutral-800/30 transition-colors duration-150 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/60 last:border-b-0">
      {/* Left & Center: Thumbnail & Metadata */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Left: Small thumbnail or placeholder */}
        <div className="w-12 h-12 rounded-lg border border-neutral-800 bg-neutral-900/80 overflow-hidden flex items-center justify-center shrink-0">
          {post.image_url ? (
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          ) : (
            <Package size={18} className="text-neutral-500" />
          )}
        </div>

        {/* Center: Item Name, Description, Location, Reporter, Reported Date */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/student/lost-found/${post.id}`} className="text-sm font-medium text-white hover:text-indigo-400 transition-colors truncate max-w-md">
              {post.title}
            </Link>
            <CategoryBadge category={post.category} />
            <span className="text-[11px] font-mono text-neutral-500">#{post.id ?? "N/A"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
            <span className="truncate max-w-xs sm:max-w-sm text-neutral-300">
              {post.description || "No description provided."}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1 text-neutral-400 shrink-0">
              <MapPin size={12} className="text-neutral-500 shrink-0" />
              <span>{post.location || "Unspecified"}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1 text-neutral-400 shrink-0">
              <User size={12} className="text-neutral-500 shrink-0" />
              <span>{post.student_name || "Community Member"}</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1 text-neutral-500 font-mono shrink-0">
              <Calendar size={12} className="text-neutral-500 shrink-0" />
              <span>{dateText}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Status Badge & Action Menu */}
      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-neutral-800/60">
        <StatusBadge status={post.status} />
        <Link
          to={`/student/lost-found/${post.id}`}
          className="px-3 py-1 text-xs font-medium border border-neutral-700 hover:border-neutral-600 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <Eye size={13} />
          <span>View</span>
        </Link>
      </div>
    </div>
  );
}

export default function LostFoundList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "", category: "", location: "" });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await lostFoundService.getPosts(filters);
      setPosts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to load lost & found posts:", error);
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(loadPosts, 300);
    return () => clearTimeout(timer);
  }, [loadPosts]);

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const clearFilters = () => setFilters({ search: "", status: "", category: "", location: "" });

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  const counts = {
    LOST: posts.filter(p => p.status === "LOST").length,
    FOUND: posts.filter(p => p.status === "FOUND").length,
    RETURNED: posts.filter(p => p.status === "RETURNED").length,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-6 text-neutral-200">
      
      {/* Page Header */}
      <PageHeader
        title="Lost & Found"
        subtitle="Manage campus lost and found item records and recovery workflows."
      />

      {/* Clean Unified Toolbar */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              name="search"
              placeholder="Search listings by title, keyword..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-8 pr-7 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            {filters.search && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            aria-label="Filter by Category"
            className="bg-neutral-950 border border-neutral-800 rounded-lg text-xs px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer shrink-0"
          >
            <option value="" className="bg-neutral-900 text-neutral-300">All Categories</option>
            <option value="ELECTRONICS" className="bg-neutral-900 text-neutral-300">Electronics</option>
            <option value="DOCUMENTS" className="bg-neutral-900 text-neutral-300">Documents</option>
            <option value="KEYS" className="bg-neutral-900 text-neutral-300">Keys</option>
            <option value="STATIONERY" className="bg-neutral-900 text-neutral-300">Stationery</option>
            <option value="ACCESSORIES" className="bg-neutral-900 text-neutral-300">Accessories</option>
            <option value="OTHER" className="bg-neutral-900 text-neutral-300">Other</option>
          </select>

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            aria-label="Filter by Status"
            className="bg-neutral-950 border border-neutral-800 rounded-lg text-xs px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-neutral-600 transition-colors cursor-pointer shrink-0"
          >
            <option value="" className="bg-neutral-900 text-neutral-300">All Status</option>
            <option value="LOST" className="bg-neutral-900 text-neutral-300">Lost</option>
            <option value="FOUND" className="bg-neutral-900 text-neutral-300">Found</option>
            <option value="RETURNED" className="bg-neutral-900 text-neutral-300">Returned</option>
          </select>

          {/* Location Filter */}
          <div className="relative shrink-0 min-w-[150px] flex-1 sm:flex-initial">
            <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              name="location"
              placeholder="Filter campus location..."
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full pl-7 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-0 pt-2 sm:pt-0 border-neutral-800/60">
          <Link
            to="/student/lost-found/create"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm shrink-0 w-full sm:w-auto"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Report Item</span>
          </Link>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>Showing <strong className="text-white font-mono">{posts.length}</strong> matching items</span>
          <button 
            onClick={clearFilters} 
            className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            <X size={13} />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Main Content: Structured List Layout */}
      {loading ? (
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl overflow-hidden shadow-sm">
          {[...Array(5)].map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-neutral-800/60 rounded-full flex items-center justify-center mb-3 border border-neutral-700/50">
            <Package size={22} className="text-neutral-500" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">No Lost or Found Items</h3>
          <p className="text-neutral-400 text-xs max-w-md mb-6 leading-relaxed">
            {hasActiveFilters
              ? "No community listings matched your active filter criteria. Try resetting your filters."
              : "There are no items reported currently. Create a new report to record a lost or found item."}
          </p>
          {hasActiveFilters ? (
            <button 
              onClick={clearFilters} 
              className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-medium rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              to="/student/lost-found/create"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Report Item</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl overflow-hidden shadow-sm divide-y divide-neutral-800/60">
          {posts.map((post, index) => (
            <PostCard key={post.id || index} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}