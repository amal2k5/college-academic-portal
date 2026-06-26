import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-white">AcadPortal</span>
            </Link>
            <p className="text-neutral-500 text-sm max-w-xs">
              Modern academic administration platform for institutions focused on efficiency and growth.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <h3 className="text-neutral-300 font-medium text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-indigo-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <h3 className="text-neutral-300 font-medium text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
              <li><Link to="/support" className="hover:text-indigo-400 transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
          <p>© 2026 AcadPortal Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;