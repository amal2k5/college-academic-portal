import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import {
  Search, Plus, MapPin, Calendar, User, Filter,
  Package, Clock, AlertCircle, CheckCircle, ArrowRight,
  X, ChevronDown, Sparkles,
} from "lucide-react";
import { format } from "date-fns";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const STATUS_CONFIG = {
  LOST: { label: "Lost", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-500" },
  FOUND: { label: "Found", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  RETURNED: { label: "Returned", icon: Sparkles, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", dot: "bg-violet-500" },
};

const CATEGORY_COLORS = {
  ELECTRONICS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DOCUMENTS: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  KEYS: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  STATIONERY: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  OTHER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const FILTER_FIELDS = [
  { name: "status", label: "Status", type: "select", options: [["", "All Status"], ["LOST", "Lost"], ["FOUND", "Found"], ["RETURNED", "Returned"]] },
  { name: "category", label: "Category", type: "select", options: [["", "All Categories"], ["ELECTRONICS", "Electronics"], ["DOCUMENTS", "Documents"], ["KEYS", "Keys"], ["STATIONERY", "Stationery"], ["ACCESSORIES", "Accessories"], ["OTHER", "Other"]] },
  { name: "location", label: "Location", type: "text", placeholder: "Search location...", icon: MapPin },
];

const card = "bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl";
const input = "w-full px-3 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-white placeholder-neutral-500 transition-all font-medium";

function Skeleton() {
  return (
    <div className={`${card} overflow-hidden animate-pulse`}>
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        <div className="w-full sm:w-36 h-36 bg-neutral-800 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="h-6 w-2/3 bg-neutral-800 rounded-lg" />
            <div className="h-7 w-24 bg-neutral-800 rounded-full" />
          </div>
          <div className="h-4 w-1/3 bg-neutral-800 rounded" />
          <div className="flex flex-wrap gap-3 pt-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-4 w-28 bg-neutral-800 rounded" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.LOST;
  const Icon = cfg.icon;
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-bold ${cfg.bg} ${cfg.color} border ${cfg.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <Icon size={size === "sm" ? 13 : 15} strokeWidth={2.5} />
      {cfg.label}
    </div>
  );
}

function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {category || "Other"}
    </span>
  );
}

function PostCard({ post, index }) {
  const cfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.LOST;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.4 }}>
      <Link to={`/student/lost-found/${post.id}`} className="block group">
        <div className={`${card} overflow-hidden hover:border-neutral-700 transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-44 sm:min-w-[11rem] h-48 sm:h-auto overflow-hidden bg-neutral-800">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800/50 text-neutral-600">
                  <Package size={32} strokeWidth={1.5} />
                  <span className="text-xs mt-2 font-medium text-neutral-500">No image</span>
                </div>
              )}
              <div className="absolute top-3 left-3 sm:hidden">
                <StatusBadge status={post.status} />
              </div>
            </div>

            <div className="flex-1 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CategoryBadge category={post.category} />
                    <span className="text-xs text-neutral-500">#{post.id ?? "N/A"}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
                <div className="hidden sm:block shrink-0">
                  <StatusBadge status={post.status} />
                </div>
              </div>

              {post.description && (
                <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <MapPin size={14} className={cfg.color} />
                  </div>
                  <span className="truncate font-medium">{post.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <User size={14} className="text-blue-400" />
                  </div>
                  <span className="truncate font-medium">{post.student_name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Calendar size={14} className="text-amber-400" />
                  </div>
                  <span className="font-medium">{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Clock size={12} />
                  <span>{format(new Date(post.created_at), "h:mm a")}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <span>View Details</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
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
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="min-h-screen bg-neutral-950">
      <div className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Lost & Found</h1>
                <p className="text-sm text-neutral-400">Report lost items or help return found items</p>
              </div>
            </div>
            <Link
              to="/student/lost-found/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all self-start lg:self-center active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              Report Item
            </Link>
          </div>

          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilters(prev => ({ ...prev, status: prev.status === key ? "" : key }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shrink-0 ${filters.status === key ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-neutral-800/50 text-neutral-400 border-neutral-700 hover:border-neutral-600"
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-xs font-bold ${filters.status === key ? "bg-white/10" : "bg-neutral-800 text-neutral-500"}`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className={`${card} p-4`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                name="search"
                placeholder="Search by title, location, or description..."
                value={filters.search}
                onChange={handleFilterChange}
                className={`${input} pl-11 py-3`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all ${hasActiveFilters ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-neutral-700 bg-neutral-800/50 text-neutral-400 hover:border-neutral-600"
                }`}
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              {hasActiveFilters && (
                <span className="ml-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-800">
                  {FILTER_FIELDS.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{field.label}</label>
                      {field.type === "select" ? (
                        <select name={field.name} value={filters[field.name]} onChange={handleFilterChange} className={`${input} cursor-pointer`}>
                          {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      ) : (
                        <div className="relative">
                          {field.icon && <field.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />}
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name]}
                            onChange={handleFilterChange}
                            className={`${input} ${field.icon ? "pl-10" : ""}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {hasActiveFilters && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                    <span className="text-xs text-neutral-500 font-medium">{posts.length} results found</span>
                    <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors">
                      <X size={14} />
                      Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} />)}</div>
        ) : posts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${card} p-16 text-center`}>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mb-5">
                <Package size={36} className="text-neutral-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">No Items Found</h3>
              <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
                {hasActiveFilters ? "No items match your current filters. Try adjusting your search criteria." : "There are no lost or found items reported yet. Be the first to report!"}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all">
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}