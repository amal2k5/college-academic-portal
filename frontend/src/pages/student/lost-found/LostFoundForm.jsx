import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import PageHeader from "../../../components/common/PageHeader";
import { Upload, X, ArrowLeft, Image as ImageIcon } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neutral-700 border-t-emerald-500 rounded-full animate-spin"></div></div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-3xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-300"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <PageHeader
        title={isEdit ? "Edit Post" : "Report Lost/Found Item"}
        subtitle={isEdit ? "Update the details of your item." : "Fill in the details below to post an item."}
      />

      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 mt-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black Dell Laptop"
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Status <span className="text-red-500">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
            >
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
              {isEdit && <option value="RETURNED">Returned</option>}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
            >
              <option value="ELECTRONICS">Electronics</option>
              <option value="DOCUMENTS">Documents</option>
              <option value="KEYS">Keys</option>
              <option value="STATIONERY">Stationery</option>
              <option value="ACCESSORIES">Accessories</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Library, Ground Floor"
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Contact Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide detailed description like brand, color, distinguishing marks..."
              className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white resize-none"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-neutral-300">Image (Optional)</label>
            
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-950 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Upload size={18} className="text-neutral-500" />
                </div>
                <p className="text-sm text-neutral-400">Click to upload an image</p>
                <p className="text-xs text-neutral-600">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                  <X size={16} />
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

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? "Update Post" : "Submit Post"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
