import React from "react";
import { getCardTheme } from "./cardThemes";

function StatCard({ title, label, value, icon: CustomIcon, trend, badge, className = "" }) {
  const displayTitle = title || label || "Statistic";
  const theme = getCardTheme(displayTitle);
  const IconComponent = CustomIcon || theme.defaultIcon;

  return (
    <div
      className={`group relative overflow-hidden rounded-[20px] p-[24px] bg-[#0F172A] bg-gradient-to-br ${theme.gradient} border border-white/[0.08] backdrop-blur-md shadow-xl ${theme.shadowColor} transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] flex flex-col justify-between gap-[16px] h-full min-h-[180px] select-none ${className}`}
    >
      {/* Background Decorative Illustration (Right side, 8-12% opacity, decorative only) */}
      <div
        className="absolute right-[-8%] bottom-[-8%] w-[45%] max-w-[135px] h-[70%] max-h-[135px] flex items-end justify-end opacity-[0.10] pointer-events-none overflow-hidden text-white transition-transform duration-500 ease-out group-hover:scale-105"
        aria-hidden="true"
        role="presentation"
      >
        {theme.illustration}
      </div>

      {/* Top Row: Icon in coloured accent container & Optional Badge/Trend */}
      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${theme.iconContainer}`}>
          <IconComponent size={20} strokeWidth={1.8} />
        </div>

        {(trend || badge) && (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm shadow-sm shrink-0 ${theme.badgeClass}`}>
            {trend || badge}
          </span>
        )}
      </div>

      {/* Middle & Bottom: Large Metric and Label */}
      <div className="relative z-10 flex flex-col justify-end flex-1 mt-auto">
        <h2 className="text-4xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
          {value}
        </h2>
        <p className="text-sm font-medium text-gray-400 mt-2 truncate max-w-[75%]">
          {displayTitle}
        </p>
      </div>
    </div>
  );
}

export default StatCard;