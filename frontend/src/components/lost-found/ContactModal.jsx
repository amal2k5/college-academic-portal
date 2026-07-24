import { X, User, Mail, Phone } from "lucide-react";

export default function ContactModal({ open, contact, onClose }) {
  if (!open || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/30">
          <div className="flex items-center gap-2">
            <User size={18} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Owner Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
              <User size={18} className="text-neutral-400" />
            </div>
            <div>
              <div className="text-xs text-neutral-500 font-medium">Name</div>
              <div className="text-sm text-white font-medium">{contact.name || "Unknown"}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
              <Mail size={18} className="text-neutral-400" />
            </div>
            <div>
              <div className="text-xs text-neutral-500 font-medium">Email</div>
              <div className="text-sm text-white font-medium">{contact.email || "-"}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
              <Phone size={18} className="text-neutral-400" />
            </div>
            <div>
              <div className="text-xs text-neutral-500 font-medium">Contact Number</div>
              <div className="text-sm text-white font-medium">{contact.contact_number || "-"}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-neutral-950/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
