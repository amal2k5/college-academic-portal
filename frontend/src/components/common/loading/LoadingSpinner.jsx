import React from "react";

function LoadingSpinner({ size = 16, className = "", color = "border-t-white border-slate-700" }) {
  const sizePx = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      style={{ width: sizePx, height: sizePx }}
      className={`inline-block border-2 ${color} rounded-full animate-smooth-spin shrink-0 select-none ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

export default LoadingSpinner;
