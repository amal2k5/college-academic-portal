import { motion } from "framer-motion";
import { BellOff } from "lucide-react";
import NoticeCard from "./NoticeCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

function NoticeFeed({
  notices = [],
  onEdit,
  onDelete,
  onTogglePin,
}) {
  if (!notices || notices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-neutral-900/30 border border-neutral-800/50 backdrop-blur-xl max-w-md mx-auto my-8 shadow-2xl"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
          <BellOff size={20} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest leading-none mb-2">
          No Notices Available
        </h3>
        
        <p className="text-xs text-neutral-500 max-w-[280px] leading-relaxed">
          There are currently no notices to display.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {notices.map((notice) => (
        <NoticeCard
  key={notice.id}
  notice={notice}
  onEdit={onEdit}
  onDelete={onDelete}
  onTogglePin={onTogglePin}
/>
      ))}
    </motion.div>
  );
}

export default NoticeFeed;
