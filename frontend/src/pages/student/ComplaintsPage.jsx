import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

const ComplaintsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader
        title="Complaints"
        subtitle="Submit a new complaint or track the status of an existing one."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => navigate("/student/complaints/submit")}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:bg-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-lg"
        >
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
            <MessageSquarePlus size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Submit Complaint</h3>
          <p className="text-neutral-400 text-sm">
            Report an issue or grievance to the college or your department.
          </p>
        </div>

        <div 
          onClick={() => navigate("/student/complaints/track")}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:bg-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-lg"
        >
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Track Complaint</h3>
          <p className="text-neutral-400 text-sm">
            Check the current status of your submitted complaints using the tracking code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
