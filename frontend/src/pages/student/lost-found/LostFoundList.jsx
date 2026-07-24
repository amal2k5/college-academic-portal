import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import PageHeader from "../../../components/common/PageHeader";
import { Search, Filter, Plus, MapPin, Calendar, User } from "lucide-react";
import { format } from "date-fns";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Skeleton() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-800" />
      <div className="p-5 space-y-4">
        <div className="h-6 w-3/4 rounded-lg bg-neutral-800" />
        <div className="space-y-2">
          <div className="h-4 w-1/2 rounded bg-neutral-800" />
          <div className="h-4 w-2/3 rounded bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

export default function LostFoundList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    location: "",
  });

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
    // Add a small debounce for search
    const timer = setTimeout(() => {
      loadPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadPosts]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LOST": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "FOUND": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "RETURNED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-300 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="Lost & Found"
          subtitle="Report lost items or help return found items to their owners."
        />
        <Link
          to="/student/lost-found/create"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Report Item
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            name="search"
            placeholder="Search items..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white"
          />
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white min-w-[120px]"
        >
          <option value="">All Statuses</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
          <option value="RETURNED">Returned</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white min-w-[120px]"
        >
          <option value="">All Categories</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="DOCUMENTS">Documents</option>
          <option value="KEYS">Keys</option>
          <option value="STATIONERY">Stationery</option>
          <option value="ACCESSORIES">Accessories</option>
          <option value="OTHER">Other</option>
        </select>
        <div className="relative flex-1 md:max-w-[200px]">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center">
          <Filter size={32} className="text-neutral-600 mb-3" />
          <h3 className="text-sm font-medium text-white mb-1">No items found</h3>
          <p className="text-xs text-neutral-400">
            Try adjusting your filters or report a new item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/student/lost-found/${post.id}`} className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors">
              <div className="h-48 bg-neutral-950 relative overflow-hidden flex-shrink-0">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">No Image</div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider border backdrop-blur-md ${getStatusColor(post.status)}`}>
                  {post.status}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-neutral-500 mb-2 font-medium tracking-wide uppercase">{post.category}</div>
                <h3 className="text-lg font-semibold text-white mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">{post.title}</h3>
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <MapPin size={14} className="text-neutral-500" />
                    <span className="line-clamp-1">{post.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <User size={14} className="text-neutral-500" />
                      <span className="truncate max-w-[100px]">{post.posted_by_name || post.user?.first_name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                      <Calendar size={12} />
                      {format(new Date(post.created_at), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
