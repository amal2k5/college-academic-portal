import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

function LoadingCard({ className = "" }) {
  return (
    <div
      className={`rounded-[20px] bg-[#0F172A] border border-white/[0.08] p-[24px] min-h-[180px] flex flex-col justify-between select-none pointer-events-none ${className}`}
      role="status"
      aria-label="Loading statistic..."
    >
      <div className="flex items-start justify-between mb-4">
        <LoadingSkeleton width="w-11" height="h-11" rounded="rounded-xl" />
        <LoadingSkeleton width="w-16" height="h-6" rounded="rounded-full" />
      </div>
      <div className="space-y-2 mt-auto">
        <LoadingSkeleton width="w-24" height="h-8" rounded="rounded-lg" />
        <LoadingSkeleton width="w-32" height="h-4" rounded="rounded-md" />
      </div>
    </div>
  );
}

export default LoadingCard;
