import React from "react";
import { getCardTheme } from "./cardThemes";

function StatCard({ title, label, value, icon: CustomIcon, trend, badge, className = "" }) {
  const displayTitle = title || label || "Statistic";
  const theme = getCardTheme(displayTitle);
  const IconComponent = CustomIcon || theme.defaultIcon;

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] p-[24px] bg-gradient-to-br ${theme.gradient} border border-white/15 backdrop-blur-md shadow-xl ${theme.shadowColor} transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] flex flex-col justify-between h-full min-h-[160px] select-none ${className}`}
    >
      {/* Background Decorative Illustration (35-45% width, 15% opacity, decorative) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[40%] flex items-center justify-end pr-3 opacity-15 pointer-events-none overflow-hidden"
        aria-hidden="true"
        role="presentation"
      >
        {theme.illustration}
      </div>

      {/* Top Row: Icon in circular background & Optional Badge/Trend */}
      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className="w-11 h-11 rounded-full bg-black/20 border border-white/15 flex items-center justify-center backdrop-blur-sm text-white shrink-0 shadow-inner">
          <IconComponent size={20} strokeWidth={1.75} />
        </div>

        {(trend || badge) && (
          <span className="px-3 py-1 text-xs font-semibold text-white/90 bg-black/25 rounded-full border border-white/15 backdrop-blur-sm shadow-sm shrink-0">
            {trend || badge}
          </span>
        )}
      </div>

      {/* Center & Bottom: Metric and Label */}
      <div className="mt-5 relative z-10 flex flex-col justify-end flex-1">
        <h2 className="text-3xl font-bold text-white tracking-tight leading-none drop-shadow-sm">
          {value}
        </h2>
        <p className="text-sm font-medium text-white/80 mt-1.5 truncate max-w-[65%]">
          {displayTitle}
        </p>
      </div>
    </div>
  );
}

export default StatCard;