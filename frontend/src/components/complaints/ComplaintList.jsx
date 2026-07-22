import React, { useState, useMemo } from "react";
import { Search, Filter, AlertCircle, Inbox, Loader2 } from "lucide-react";
import ComplaintCard from "./ComplaintCard";

const COMPLAINT_CATEGORIES = [
  "All",
  "Academic",
  "Infrastructure",
  "Hostel",
  "Administration",
  "Extracurricular",
  "Other"
];

const COMPLAINT_STATUSES = ["All", "Pending", "Seen", "Resolved"];

const ComplaintList = ({ complaints = [], role, onUpdateStatus, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch = c.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || (c.status || "Pending") === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [complaints, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search tracking code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {COMPLAINT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              {COMPLAINT_STATUSES.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 h-48 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                  <div className="h-5 bg-neutral-800 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-full"></div>
                  <div className="h-3 bg-neutral-800 rounded w-5/6"></div>
                </div>
                <div className="h-3 bg-neutral-800 rounded w-1/4 mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-500/5 border border-red-500/10 rounded-2xl">
            <AlertCircle className="text-red-500 mb-3" size={32} />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-2xl">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <Inbox className="text-neutral-500" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No complaints found</h3>
            <p className="text-neutral-500 text-sm">
              {searchTerm || categoryFilter !== "All" || statusFilter !== "All" 
                ? "Try adjusting your search or filters." 
                : "There are no complaints to display."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id || complaint.trackingCode} 
                complaint={complaint} 
                role={role}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;
