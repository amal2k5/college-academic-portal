function Navbar() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded flex items-center justify-center">
              <span className="text-white text-sm font-medium">AP</span>
            </div>
            <span className="font-medium text-[#1e3a5f] text-lg tracking-tight">
              Academic Portal
            </span>
          </div>

          {/* User Role */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-normal">Super Admin</span>
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-sm font-medium">
              SA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;