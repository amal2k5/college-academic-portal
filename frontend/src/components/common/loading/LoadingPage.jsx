import React from "react";
import { GraduationCap } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

function LoadingPage({ text = "Loading workspace...", fullScreen = false, className = "" }) {
  return (
    <div
      className={`${
        fullScreen
          ? "min-h-screen w-full fixed inset-0 z-50 bg-[#0F172A]"
          : "w-full min-h-[400px] flex-1 rounded-[20px] bg-[#0F172A]/90 border border-white/[0.06]"
      } flex flex-col items-center justify-center p-8 text-center select-none ${className}`}
      role="status"
      aria-label={text}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-14 h-14 rounded-[18px] bg-slate-900 border border-white/[0.08] shadow-2xl flex items-center justify-center text-indigo-400 mb-1">
          <GraduationCap size={28} strokeWidth={1.5} className="animate-soft-pulse" />
        </div>
      </div>
      <LoadingSpinner size={20} color="border-t-indigo-400 border-slate-800" className="mb-3" />
      {text && <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-soft-pulse">{text}</p>}
    </div>
  );
}

export default LoadingPage;
