import { X, User, Mail, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactModal({ open, contact, onClose }) {
  if (!open || !contact) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-md bg-[#0F172A] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-2xl relative text-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Owner Contact Details</h2>
                <p className="text-xs text-slate-400 font-medium">Verified Campus Member</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-3.5">
            <p className="text-xs text-slate-400 leading-relaxed mb-1">
              Please be respectful when contacting the owner to return or inquire about this listed item.
            </p>

            {/* Name Field */}
            <div className="flex items-center gap-3.5 bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-xl hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-sm">
                <User size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student / Faculty Name</div>
                <div className="text-sm font-semibold text-white truncate mt-0.5">{contact.name || "Unknown Member"}</div>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="flex items-center gap-3.5 bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-xl hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                <div className="text-sm font-semibold text-white truncate mt-0.5 select-all">{contact.email || "Not Provided"}</div>
              </div>
            </div>
            
            {/* Contact Number Field */}
            <div className="flex items-center gap-3.5 bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-xl hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                <Phone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contact / Phone Number</div>
                <div className="text-sm font-bold font-mono text-emerald-300 truncate mt-0.5 select-all">{contact.contact_number || "Not Provided"}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.06] bg-slate-900/40 flex justify-end">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 shadow-md active:scale-95"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
