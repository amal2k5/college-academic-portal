import React, { useState, useRef, useEffect, useMemo } from "react";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Recursively extracts raw string text from React children to deduce action verb.
 */
function extractText(node) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join(" ");
  }
  if (React.isValidElement(node) && node.props && node.props.children) {
    return extractText(node.props.children);
  }
  return "";
}

/**
 * Resolves standard ERP action strings into active continuous tense for loading state.
 */
function getContextualLoadingText(rawText) {
  if (!rawText) return "Processing...";
  const text = rawText.trim().toLowerCase();

  // Primary ERP action mapping
  if (text.startsWith("sign in") || text.startsWith("log in") || text.startsWith("login")) return "Signing in...";
  if (text.startsWith("sign up") || text.startsWith("register") || text.startsWith("create account")) return "Registering...";
  if (text.startsWith("save")) return "Saving...";
  if (text.startsWith("submit") || text === "send" || text.startsWith("send ")) return "Submitting...";
  if (text.startsWith("publish")) return "Publishing...";
  if (text.startsWith("approve")) return "Approving...";
  if (text.startsWith("reject")) return "Rejecting...";
  if (text.startsWith("delete") || text.startsWith("remove") || text.startsWith("destroy")) return "Deleting...";
  if (text.startsWith("update")) return "Updating...";
  if (text.startsWith("create") || text.startsWith("add ")) return "Creating...";
  if (text.startsWith("confirm") || text.startsWith("verify")) return "Confirming...";
  if (text.startsWith("upload")) return "Uploading...";
  if (text.startsWith("download")) return "Downloading...";
  if (text.startsWith("search")) return "Searching...";
  if (text.startsWith("filter")) return "Filtering...";
  if (text.startsWith("apply")) return "Applying...";
  if (text.startsWith("reset")) return "Resetting...";
  if (text.startsWith("generate") || text.startsWith("calculate")) return "Processing...";

  // Grammatical progressive tense generator fallback
  const firstWord = rawText.trim().split(/\s+/)[0];
  if (firstWord && firstWord.length >= 3 && /^[a-zA-Z]+$/.test(firstWord)) {
    if (firstWord.toLowerCase().endsWith("e") && !firstWord.toLowerCase().endsWith("ee")) {
      return `${firstWord.slice(0, -1)}ing...`;
    }
    return `${firstWord}ing...`;
  }

  return "Processing...";
}

function LoadingButton({
  children,
  loading = false,
  disabled = false,
  loadingText,
  className = "",
  spinnerSize = 15,
  spinnerColor = "border-t-white border-white/30",
  icon,
  type = "button",
  onClick,
  ...props
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isExecutingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isBusy = loading || internalLoading;

  const resolvedLoadingText = useMemo(() => {
    if (loadingText !== undefined) {
      return loadingText;
    }
    const extracted = extractText(children);
    return getContextualLoadingText(extracted);
  }, [loadingText, children]);

  const handleClick = async (e) => {
    if (isBusy || disabled || isExecutingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
     }

    if (onClick) {
      const result = onClick(e);
      // Automatically guard and indicate loading if onClick returns a Promise
      if (result && typeof result.then === "function") {
        isExecutingRef.current = true;
        setInternalLoading(true);
        try {
          await result;
        } finally {
          isExecutingRef.current = false;
          if (isMountedRef.current) {
            setInternalLoading(false);
          }
        }
      }
    }
  };

  return (
    <button
      type={type}
      disabled={isBusy || disabled}
      aria-busy={isBusy}
      aria-disabled={isBusy || disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed select-none ${className}`}
      {...props}
    >
      <span className="inline-grid grid-cols-1 grid-rows-1 items-center justify-items-center w-full max-w-full">
        {/* Default / Static Action State */}
        <span
          className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition-opacity duration-200 ${
            isBusy ? "opacity-0 pointer-events-none select-none invisible" : "opacity-100 visible"
          }`}
        >
          {icon && <span className="shrink-0 flex items-center">{icon}</span>}
          {children}
        </span>

        {/* Active Async Loading State */}
        <span
          className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2.5 transition-opacity duration-200 ${
            isBusy ? "opacity-100 visible" : "opacity-0 pointer-events-none select-none invisible"
          }`}
        >
          <LoadingSpinner size={spinnerSize} color={spinnerColor} />
          <span className="truncate">{resolvedLoadingText}</span>
        </span>
      </span>
    </button>
  );
}

export default LoadingButton;
