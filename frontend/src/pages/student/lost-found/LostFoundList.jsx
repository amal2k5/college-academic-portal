import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import {
  Search, Plus, MapPin, Calendar, User, Filter,
  Package, Clock, AlertCircle, CheckCircle, ArrowRight,
  X, ChevronDown, Sparkles, Tag, Layers, Eye
} from "lucide-react";
import { format, isValid } from "date-fns";
import { LoadingSkeleton } from "../../../components/common/loading";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const STATUS_CONFIG = {
  LOST: { label: "Lost", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400" },
  FOUND: { label: "Found", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  RETURNED: { label: "Returned", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
};

const CATEGORY_COLORS = {
  ELECTRONICS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DOCUMENTS: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  KEYS: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  STATIONERY: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  ACCESSORIES: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  OTHER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const FILTER_FIELDS = [
  { name: "status", label: "Status", type: "select", options: [["", "All Status"], ["LOST", "Lost"], ["FOUND", "Found"], ["RETURNED", "Returned"]] },
  { name: "category", label: "Category", type: "select", options: [["", "All Categories"], ["ELECTRONICS", "Electronics"], ["DOCUMENTS", "Documents"], ["KEYS", "Keys"], ["STATIONERY", "Stationery"], ["ACCESSORIES", "Accessories"], ["OTHER", "Other"]] },
  { name: "location", label: "Location", type: "text", placeholder: "Search location...", icon: MapPin },
];

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "ELECTRONICS", label: "Electronics" },
  { id: "DOCUMENTS", label: "Documents" },
  { id: "KEYS", label: "Keys" },
  { id: "STATIONERY", label: "Stationery" },
  { id: "ACCESSORIES", label: "Accessories" },
  { id: "OTHER", label: "Other" },
];

function Skeleton() {
  return (
    <div className="bg-[#0F172A] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-xl p-5 flex flex-col justify-between h-full min-h-[360px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <LoadingSkeleton width="w-24" height="h-6" rounded="rounded-full" />
          <LoadingSkeleton width="w-20" height="h-5" rounded="rounded-md" />
        </div>
        <LoadingSkeleton width="w-full" height="h-44" rounded="rounded-xl" />
        <LoadingSkeleton width="w-3/4" height="h-6" rounded="rounded-lg" />
        <LoadingSkeleton width="w-full" height="h-4" rounded="rounded" />
      </div>
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
        <LoadingSkeleton width="w-28" height="h-4" rounded="rounded" />
        <LoadingSkeleton width="w-24" height="h-8" rounded="rounded-lg" />
      </div>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.LOST;
  const Icon = cfg.icon;
  const sizeClasses = size === "sm" ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-xs";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border} ${sizeClasses} shadow-sm backdrop-blur-md`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      <Icon size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
      {cfg.label}
    </div>
  );
}

function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      <Tag size={10} strokeWidth={2.5} />
      {category || "Other"}
    </span>
  );
}

function PostCard({ post, index }) {
  const cfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.LOST;
  const postDate = new Date(post.created_at);
  const dateText = isValid(postDate) ? format(postDate, "MMM d, yyyy") : "Recent";
  const timeText = isValid(postDate) ? format(postDate, "h:mm a") : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/student/lost-found/${post.id}`} className="block h-full group">
        <div className="bg-[#0F172A] bg-gradient-to-br from-slate-900/90 via-[#0F172A] to-slate-950/80 border border-white/[0.08] rounded-[20px] p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-white/[0.15] hover:-translate-y-[3px] transition-all duration-300 ease-out flex flex-col justify-between h-full">
          
          <div>
            {/* Top Bar: Status badge, Category chip, Date */}
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <StatusBadge status={post.status} />
                <CategoryBadge category={post.category} />
              </div>
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Calendar size={12} className="text-slate-500" />
                {dateText}
              </span>
            </div>

            {/* Optional Item Image or Attractive Placeholder */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 border border-white/[0.05] bg-slate-950/60 flex items-center justify-center">
              {post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  loading="lazy" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-600 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-white/[0.06] flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package size={28} className="text-slate-400 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">No Photo Available</span>
                  <span className="text-[10px] text-slate-600 font-medium mt-0.5">Community Report</span>
                </div>
              )}
            </div>

            {/* Center: Title & Short Description */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="text-white font-bold text-lg leading-snug group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {post.title}
                </h3>
                <span className="text-[10px] font-mono font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-white/[0.05]">
                  #{post.id ?? "N/A"}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                {post.description || "No specific description provided for this report."}
              </p>
            </div>

            {/* Meta Tags: Location & Reported By */}
            <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.05] text-slate-300">
                <div className={`w-6 h-6 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <MapPin size={12} className={cfg.color} />
                </div>
                <span className="truncate font-medium">{post.location || "Unspecified"}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.05] text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <User size={12} className="text-blue-400" />
                </div>
                <span className="truncate font-medium">{post.student_name || "Community Member"}</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer: Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock size={13} className="text-slate-500" />
              <span>Reported {timeText}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400 border border-white/[0.08] group-hover:border-emerald-500/30 transition-all duration-300 text-xs font-semibold shadow-sm">
              <Eye size={13} />
              <span>View Details</span>
              <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
    <motion.div initial="hidden" animate="visible" variants={pageVariants} className="min-h-screen bg-[#090D16] text-slate-200 pb-16">
      
      {/* Top Header & Navigation Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-30 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 border border-white/20">
                <Package size={24} className="text-white" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Lost & Found</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Community Board
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-medium mt-0.5">Report lost items or help return found belongings.</p>
              </div>
            </div>
            
            <Link
              to="/student/lost-found/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95 shrink-0"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Report Item</span>
            </Link>
          </div>

          {/* Status Chip Filter Bar */}
          <div className="flex items-center gap-2.5 mt-5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilters(prev => ({ ...prev, status: "" }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                filters.status === ""
                  ? "bg-slate-800 text-white border-white/20 shadow-md shadow-slate-900/50"
                  : "bg-slate-900/60 text-slate-400 border-white/[0.06] hover:border-white/15 hover:text-slate-300"
              }`}
            >
              <Layers size={13} className="text-slate-400" />
              <span>All Status</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${filters.status === "" ? "bg-white/10 text-white" : "bg-slate-800 text-slate-400"}`}>
                {posts.length}
              </span>
            </button>
            
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const isActive = filters.status === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilters(prev => ({ ...prev, status: prev.status === key ? "" : key }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-md shadow-black/30 ring-1 ring-white/10`
                      : "bg-slate-900/60 text-slate-400 border-white/[0.06] hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span>{cfg.label}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isActive ? "bg-white/15 text-white" : "bg-slate-800 text-slate-400"}`}>
                    {counts[key] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Large Hero Search & Category Pills Panel */}
        <div className="bg-[#0F172A] border border-white/[0.08] rounded-[20px] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3.5">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="search"
                placeholder="Search listings by item title, campus location, or keywords..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-white/[0.08] rounded-xl focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-white placeholder-slate-500 transition-all font-medium shadow-inner"
              />
              {filters.search && (
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold border transition-all shrink-0 shadow-sm ${
                showFilters || (filters.location || filters.category)
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-emerald-900/20"
                  : "border-white/[0.08] bg-slate-900/80 text-slate-300 hover:border-white/15 hover:bg-slate-800/80"
              }`}
            >
              <Filter size={16} />
              <span>Advanced Filters</span>
              <ChevronDown size={15} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
              {activeFilterCount > 0 && (
                <span className="ml-0.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Pill Bar right below Search */}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">Category:</span>
              {CATEGORIES.map(cat => {
                const isCatActive = filters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(prev => ({ ...prev, category: prev.category === cat.id ? "" : cat.id }))}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
                      isCatActive
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10 scale-100"
                        : "bg-slate-900/50 text-slate-400 border-white/[0.05] hover:border-white/10 hover:text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Location & Secondary Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/[0.06]">
                  {FILTER_FIELDS.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        {field.icon && <field.icon size={13} className="text-slate-500" />}
                        <span>{field.label}</span>
                      </label>
                      {field.type === "select" ? (
                        <select 
                          name={field.name} 
                          value={filters[field.name]} 
                          onChange={handleFilterChange} 
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-200 outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                        >
                          {field.options.map(([value, label]) => <option key={value} value={value} className="bg-slate-900 text-slate-200">{label}</option>)}
                        </select>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name]}
                            onChange={handleFilterChange}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-200 outline-none focus:border-emerald-500/50 transition-all placeholder-slate-500"
                          />
                          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Clear Footer */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <span className="text-xs text-slate-400 font-medium">
                Showing <strong className="text-white font-mono">{posts.length}</strong> community items matching criteria
              </span>
              <button 
                onClick={clearFilters} 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
              >
                <X size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Listings Grid / Empty States / Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0F172A] border border-white/[0.08] rounded-[20px] p-16 text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.03] to-transparent pointer-events-none" />
            <div className="flex flex-col items-center relative z-10">
              <div className="w-24 h-24 bg-slate-900/80 border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/5 relative group">
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <Package size={42} className="text-slate-500 relative z-10 stroke-[1.5]" />
              </div>
              <h3 className="text-white font-bold text-2xl mb-2 tracking-tight">No Lost or Found Items Yet</h3>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
                {hasActiveFilters
                  ? "No community listings matched your active filter keywords or category chips. Try resetting your search."
                  : "Our community board currently has no reported items. If you lost something or found an item on campus, start by creating a report!"}
              </p>
              {hasActiveFilters ? (
                <button 
                  onClick={clearFilters} 
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Clear Active Filters
                </button>
              ) : (
                <Link
                  to="/student/lost-found/create"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Report First Item</span>
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <PostCard key={post.id || index} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}