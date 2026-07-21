import { CheckCircle2, FileText } from "lucide-react";

export default function MarksStatusBadge({ status }) {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${
        isPublished
          ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
          : "text-neutral-400 bg-neutral-800/50 border-neutral-700/50"
      }`}
    >
      {isPublished ? (
        <CheckCircle2 size={10} strokeWidth={2} />
      ) : (
        <FileText size={10} strokeWidth={2} />
      )}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
