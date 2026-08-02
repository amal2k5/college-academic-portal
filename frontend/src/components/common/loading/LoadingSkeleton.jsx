import React from "react";

function LoadingSkeleton({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-lg",
  className = "",
  variant = "pulse",
}) {
  if (variant === "shimmer") {
    return (
      <div
        className={`relative overflow-hidden bg-slate-800 border border-white/5 ${width} ${height} ${rounded} ${className} select-none pointer-events-none`}
        role="status"
        aria-label="Loading..."
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/60 to-transparent animate-soft-shimmer" />
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-800 border border-white/5 animate-soft-pulse ${width} ${height} ${rounded} ${className} select-none pointer-events-none`}
      role="status"
      aria-label="Loading..."
    />
  );
}

export default LoadingSkeleton;
