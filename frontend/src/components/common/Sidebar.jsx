import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  LayoutDashboard, Building2, Users, ClipboardList, LogOut, 
  AlertCircle, X, ChevronLeft, ChevronRight 
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

function Sidebar() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = useMemo(() => [
    { name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: "Colleges", path: ROUTES.COLLEGES, icon: Building2 },
    { name: "College Requests", path: ROUTES.COLLEGE_REQUESTS, icon: ClipboardList },
    { name: "College Admins", path: "/admin/college-admins", icon: Users },
  ], []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Confirm Logout</h3>
                </div>
                <button onClick={() => setShowConfirm(false)} className="text-neutral-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-sm font-medium">Cancel</button>
                <button onClick={handleLogout} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium shadow-lg shadow-red-900/20">Logout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Grid Approach - No width animation */}
      <aside 
        className={`min-h-screen bg-[#050505] border-r border-neutral-800/50 flex flex-col sticky top-0 z-40 overflow-hidden ${
          isExpanded ? 'w-64' : 'w-[72px]'
        }`}
        style={{ transition: 'none' }}
      >
        {/* Brand Header */}
        <div className="px-4 py-6 border-b border-neutral-800/50 flex items-center justify-between relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 ring-1 ring-blue-400/20 shrink-0">
              <span className="text-white text-xs font-bold tracking-tight">AP</span>
            </div>
            
            {/* Text fades - no max-width animation */}
            <div className={`transition-opacity duration-150 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="font-semibold text-white text-sm tracking-tight whitespace-nowrap">Academic Portal</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Super Admin</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800/50 transition-colors shrink-0 absolute right-4 top-6"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Navigation Items - Memoized */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <div className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive 
                    ? "text-white bg-blue-600/10 border border-blue-500/20" 
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30"
                }`}>
                  <item.icon className={`relative w-4 h-4 shrink-0 transition-colors duration-150 ${
                    isActive ? "text-blue-400" : "text-neutral-500 group-hover:text-neutral-300"
                  }`} />
                  
                  {/* Only opacity changes - no translate, no max-width */}
                  <span className={`relative whitespace-nowrap transition-opacity duration-150 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}>
                    {item.name}
                  </span>
                  
                  {isActive && isExpanded && (
                    <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout Trigger */}
        <div className="p-4 border-t border-neutral-800/50">
          <button 
            onClick={() => setShowConfirm(true)} 
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800/30 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-colors text-sm font-medium group ${
              !isExpanded && 'justify-center px-2'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className={`whitespace-nowrap transition-opacity duration-150 ${
              isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;