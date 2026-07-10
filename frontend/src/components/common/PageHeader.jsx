import { motion } from "framer-motion";
import { Plus } from "lucide-react";

function PageHeader({ title, subtitle, buttonText, onButtonClick, actions }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -4 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800"
    >
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-neutral-400 font-normal">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions && actions}
        
        {buttonText && (
          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }}
            onClick={onButtonClick} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-950 rounded-lg transition-colors text-xs font-semibold tracking-wide border border-neutral-200"
          >
            <Plus size={14} strokeWidth={2.5} />
            {buttonText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default PageHeader;