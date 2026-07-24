import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  message = "There is nothing to display here right now.",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-64 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-2xl ${className}`}>
      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-neutral-500" size={32} />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-neutral-500 text-sm text-center max-w-sm px-4">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
