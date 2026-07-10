import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap size={14} className="text-white sm:size-[16px]" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-white">AcadPortal</span>
            </Link>
            <p className="text-neutral-500 text-[13px] sm:text-sm max-w-xs leading-relaxed">
              Modern academic administration platform for institutions focused on efficiency and growth.
            </p>
          </div>

          {/* Links Column 1 - Product */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-neutral-300 font-medium text-[13px] sm:text-sm">Product</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm text-neutral-500">
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors duration-200">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors duration-200">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-indigo-400 transition-colors duration-200">Integrations</Link></li>
            </ul>
          </div>

          {/* Links Column 2 - Company */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-neutral-300 font-medium text-[13px] sm:text-sm">Company</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm text-neutral-500">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors duration-200">Privacy</Link></li>
              <li><Link to="/support" className="hover:text-indigo-400 transition-colors duration-200">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-neutral-600">
          <p className="text-center sm:text-left">© 2026 AcadPortal Technologies. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <span className="hover:text-neutral-400 transition-colors duration-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;