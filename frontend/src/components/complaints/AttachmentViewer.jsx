import React, { useState } from "react";
import { Paperclip, X, Download, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AttachmentViewer = ({ url, className = "" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-xl text-neutral-500 w-fit ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-neutral-800/50 flex items-center justify-center">
          <Paperclip size={14} className="opacity-50" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium">No Attachment</span>
          <span className="text-[10px] uppercase tracking-wider opacity-60">File not provided</span>
        </div>
      </div>
    );
  }

  // Simple heuristic to check if the URL points to an image
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) || url.includes("/image/upload/");

  if (isImage) {
    return (
      <>
        <div 
          className={`relative group cursor-pointer overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 w-full max-w-sm ${className}`}
          onClick={() => !hasError && setIsFullscreen(true)}
        >
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 animate-pulse">
              <ImageIcon size={24} className="text-neutral-700" />
            </div>
          )}
          
          {hasError ? (
            <div className="flex flex-col items-center justify-center h-40 bg-neutral-900/50 text-neutral-500 gap-2">
              <AlertCircle size={24} className="text-neutral-600" />
              <span className="text-xs">Failed to load image</span>
            </div>
          ) : (
            <img 
              src={url} 
              alt="Complaint Attachment" 
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              className={`w-full h-40 object-cover transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
            />
          )}
          
          {!hasError && !isLoading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium px-3 py-1.5 bg-black/50 rounded-lg backdrop-blur-sm shadow-xl flex items-center gap-2">
                Click to Enlarge
              </span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isFullscreen && !hasError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
              onClick={() => setIsFullscreen(false)}
            >
              <button 
                className="absolute top-6 right-6 p-2 bg-neutral-800/80 text-white rounded-full hover:bg-neutral-700 transition-colors z-50 backdrop-blur-sm"
                onClick={() => setIsFullscreen(false)}
              >
                <X size={24} />
              </button>
              
              <motion.img 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={url} 
                alt="Enlarged Attachment" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                 <a 
                   href={url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="px-4 py-2 bg-neutral-800/80 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2"
                   onClick={(e) => e.stopPropagation()}
                 >
                   <Download size={16} />
                   Download Image
                 </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Non-image document
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/80 rounded-xl transition-all group w-full max-w-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
          <FileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-200 line-clamp-1">Attached Document</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Click to view or download</span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-indigo-400 group-hover:bg-neutral-700 transition-colors">
        <Download size={16} />
      </div>
    </a>
  );
};

export default AttachmentViewer;
