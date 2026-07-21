function Badge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
        isActive
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default Badge;