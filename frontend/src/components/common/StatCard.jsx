function StatCard({ title, value }) {
  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-neutral-700/80 transition-colors shadow-sm group">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-white mt-3 tracking-tight">
        {value}
      </h2>
    </div>
  );
}

export default StatCard;