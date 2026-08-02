import React from "react";
import LoadingSpinner from "./LoadingSpinner";

function LoadingButton({
  children,
  loading = false,
  disabled = false,
  loadingText,
  className = "",
  spinnerSize = 16,
  spinnerColor = "border-t-white border-white/20",
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed select-none ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size={spinnerSize} color={spinnerColor} />
          <span>{loadingText !== undefined ? loadingText : children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default LoadingButton;
