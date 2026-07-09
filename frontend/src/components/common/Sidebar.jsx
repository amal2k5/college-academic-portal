import { NavLink, useLocation } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar({ 
  isExpanded, 
  setIsExpanded, 
  isMobileOpen, 
  setIsMobileOpen, 
  navSections, 
  brandIcon: BrandIcon,
  brandTitle,
  brandSubtitle,
  onLogout 
}) {
  const location = useLocation();

  // Handle mobile overlay click
  const handleOverlayClick = () => {
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-neutral-800 shrink-0">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${!isExpanded && "w-0 opacity-0"}`}>
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            {BrandIcon && <BrandIcon size={16} strokeWidth={2} className="text-indigo-400" />}
          </div>
          <div className="flex flex-col whitespace-nowrap min-w-0">
            <span className="text-[13px] font-bold text-neutral-100 tracking-wide truncate">
              {brandTitle}
            </span>
            {brandSubtitle && (
              <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] truncate">
                {brandSubtitle}
              </span>
            )}
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden md:flex p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && isExpanded && (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                {section.title}
              </div>
            )}
            
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              
              return (
                <div key={item.path} className="relative group">
                  <NavLink
                    to={item.path}
                    end={item.path === "/"} // or adjust based on exact match needs
                    onClick={() => setIsMobileOpen(false)} // close mobile on click
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/15 text-indigo-400 border border-indigo-600/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent"
                    }`}
                  >
                    <Icon 
                      size={16} 
                      strokeWidth={isActive ? 2 : 1.5}
                      className={`shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-300"}`}
                    />
                    
                    <span 
                      className={`text-[12px] font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
                        !isExpanded ? "opacity-0 w-0 hidden md:block" : "opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                    
                    {isActive && isExpanded && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </NavLink>
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-800 text-white text-[11px] font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-neutral-700/50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-neutral-800 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 cursor-pointer group"
        >
          <LogOut size={16} strokeWidth={1.5} className="shrink-0 group-hover:text-rose-400" />
          <span 
            className={`text-[12px] font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
              !isExpanded ? "opacity-0 w-0 hidden md:block" : "opacity-100"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen transition-[width] duration-300 ease-in-out z-30"
        style={{ width: isExpanded ? "260px" : "72px" }}
      >
        {navContent}
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={handleOverlayClick}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
            >
              {/* Ensure mobile always renders as expanded visually */}
              <div className="h-full w-full">
                <Sidebar 
                  isExpanded={true} 
                  setIsExpanded={() => {}} 
                  isMobileOpen={false} 
                  setIsMobileOpen={setIsMobileOpen}
                  navSections={navSections}
                  brandIcon={BrandIcon}
                  brandTitle={brandTitle}
                  brandSubtitle={brandSubtitle}
                  onLogout={onLogout}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;