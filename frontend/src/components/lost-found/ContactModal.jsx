import { X, User, Mail, Phone } from "lucide-react";

export default function ContactModal({ open, contact, onClose }) {
  if (!open || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Owner Contact Details</h2>
            <p className="text-[11px] text-neutral-400 font-normal">Verified Campus Database Record</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3 text-xs">
          {/* Name Field */}
          <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-800/80 p-3 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-400 shrink-0">
              <User size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Name</div>
              <div className="text-xs font-medium text-white truncate mt-0.5">{contact.name || "Unknown Member"}</div>
            </div>
          </div>
          
          {/* Email Field */}
          <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-800/80 p-3 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-400 shrink-0">
              <Mail size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Email Address</div>
              <div className="text-xs font-medium text-white truncate mt-0.5 select-all">{contact.email || "Not Provided"}</div>
            </div>
          </div>
          
          {/* Contact Number Field */}
          <div className="flex items-center gap-3 bg-neutral-950/60 border border-neutral-800/80 p-3 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-400 shrink-0">
              <Phone size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Phone Number</div>
              <div className="text-xs font-medium font-mono text-white truncate mt-0.5 select-all">{contact.contact_number || "Not Provided"}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
