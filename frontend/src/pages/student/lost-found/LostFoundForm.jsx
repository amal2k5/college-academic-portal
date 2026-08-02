import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import { Upload, X, ArrowLeft, Sparkles, Package, MapPin, Phone } from "lucide-react";
import { LoadingPage, LoadingSpinner } from "../../../components/common/loading";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LostFoundForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "OTHER",
    status: "LOST",
    location: "",
    contact_number: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      lostFoundService.getPost(id)
        .then((data) => {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "OTHER",
            status: data.status || "LOST",
            location: data.location || "",
            contact_number: data.contact_number || "",
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        })
        .catch(() => {
          toast.error("Failed to load post for editing.");
          navigate("/student/lost-found");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.description.trim()) return toast.error("Description is required");
    if (!formData.location.trim()) return toast.error("Location is required");
    if (!formData.contact_number.trim()) return toast.error("Contact number is required");

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (imageFile) {
        payload.image = imageFile;
      }

      if (isEdit) {
        await lostFoundService.updatePost(id, payload);
        toast.success("Post updated successfully!");
        navigate(`/student/lost-found/${id}`);
      } else {
        await lostFoundService.createPost(payload);
        toast.success("Post created successfully!");
        navigate("/student/lost-found");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingPage text="Loading Post details..." fullScreen={true} />;
  }

  const inputClass = "w-full px-4 py-3 bg-slate-950/70 border border-white/[0.08] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500 shadow-inner";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-3xl mx-auto py-8 px-4 sm:px-6 md:px-8 min-h-screen text-slate-300 pb-20"
    >
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group px-3 py-1.5 rounded-xl hover:bg-slate-900/50 -ml-3"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Marketplace</span>
      </button>

      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Package size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isEdit ? "Edit Item Listing" : "Report Lost/Found Item"}
          </h1>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          {isEdit 
            ? "Update the details, status, or photos of your existing community post." 
            : "Fill in accurate details below to help our campus community identify and recover the item."
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0F172A] bg-gradient-to-br from-slate-900/90 via-[#0F172A] to-slate-950 border border-white/[0.08] rounded-[20px] p-6 sm:p-8 space-y-6 shadow-2xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title Input */}
          <div className="md:col-span-2">
            <label className={labelClass}>Item Title <span className="text-rose-400">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Matte Black iPad Pro with Blue Smart Cover"
              className={inputClass}
            />
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Be descriptive and clear so members can immediately recognize the item.
            </span>
          </div>

          {/* Status Selector */}
          <div>
            <label className={labelClass}>Report Type & Status <span className="text-rose-400">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="LOST" className="bg-slate-900 text-white">Lost (I lost this item)</option>
              <option value="FOUND" className="bg-slate-900 text-white">Found (I found this item)</option>
              {isEdit && <option value="RETURNED" className="bg-slate-900 text-white">Returned / Resolved</option>}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className={labelClass}>Item Category <span className="text-rose-400">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="ELECTRONICS" className="bg-slate-900 text-white">Electronics & Gadgets</option>
              <option value="DOCUMENTS" className="bg-slate-900 text-white">ID & Documents</option>
              <option value="KEYS" className="bg-slate-900 text-white">Keys & Keychains</option>
              <option value="STATIONERY" className="bg-slate-900 text-white">Books & Stationery</option>
              <option value="ACCESSORIES" className="bg-slate-900 text-white">Bags, Clothing & Accessories</option>
              <option value="OTHER" className="bg-slate-900 text-white">Other / General Items</option>
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className={labelClass}>Campus Location <span className="text-rose-400">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Central Library, 2nd Floor Reading Hall"
                className={`${inputClass} pl-10`}
              />
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Contact Number Input */}
          <div>
            <label className={labelClass}>Contact Number <span className="text-rose-400">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className={`${inputClass} pl-10 font-mono`}
              />
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="md:col-span-2">
            <label className={labelClass}>Detailed Description <span className="text-rose-400">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide identifiable details such as brand name, serial tags, scratches, colors, or exact time when seen..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Image Uploader & Dropzone */}
          <div className="md:col-span-2">
            <label className={labelClass}>Item Photograph (Optional)</label>
            
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/[0.12] rounded-2xl bg-slate-950/40 hover:bg-slate-900/60 hover:border-emerald-500/50 flex flex-col items-center justify-center p-8 gap-3 cursor-pointer transition-all duration-300 group shadow-inner"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/[0.08] flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all duration-300 shadow-md">
                  <Upload size={20} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Click to browse and attach an image
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Supported formats: JPG, PNG or WEBP (Max size: 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-h-72 rounded-2xl border border-white/[0.1] overflow-hidden bg-slate-950 flex items-center justify-center p-3 shadow-xl group">
                <img src={imagePreview} alt="Preview" className="max-h-64 w-auto object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-3 right-3 p-2 bg-slate-900/90 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl border border-white/20 backdrop-blur-md transition-all duration-200 shadow-lg flex items-center gap-1.5 text-xs font-bold"
                >
                  <X size={15} />
                  <span>Remove Photo</span>
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3.5 pt-6 mt-6 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-all disabled:opacity-50 border border-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95"
          >
            {submitting ? (
              <>
                <LoadingSpinner size={16} color="border-t-white border-white/30" />
                <span>Saving Details...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>{isEdit ? "Update Listing" : "Publish Listing"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
