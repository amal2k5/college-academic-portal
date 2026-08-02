import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

function LoadingTable({ rows = 6, columns = 5, header = true, className = "" }) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl bg-slate-900/80 border border-white/[0.08] shadow-xl ${className}`} role="status" aria-label="Loading table...">
      {header && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/[0.08] gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={i} width={i === 0 ? "w-32" : "w-24"} height="h-3.5" rounded="rounded-md" />
          ))}
        </div>
      )}
      <div className="divide-y divide-white/[0.06]">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between px-6 py-4 gap-4 bg-slate-900/40">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <LoadingSkeleton
                key={cIdx}
                width={cIdx === 0 ? "w-40" : cIdx === 1 ? "w-28" : "w-20"}
                height="h-4"
                rounded="rounded-lg"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingTable;
