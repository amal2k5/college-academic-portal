import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import { Upload, X, ArrowLeft, MapPin, Phone } from "lucide-react";
import { LoadingPage, LoadingSpinner } from "../../../components/common/loading";

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
    return <LoadingPage text="Loading Record Details..." fullScreen={true} />;
  }

  const inputClass = "w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs font-medium focus:outline-none focus:border-neutral-600 transition-colors placeholder-neutral-500";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-neutral-300 block mb-1.5";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 md:px-8 min-h-screen text-neutral-200 space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors py-1 rounded-lg"
      >
        <ArrowLeft size={15} />
        <span>Back to Lost & Found</span>
      </button>

      <div className="border-b border-neutral-800 pb-5 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          {isEdit ? "Edit Item Record" : "Report Lost / Found Item"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-normal">
          {isEdit 
            ? "Modify existing lost and found item record details and status." 
            : "Enter accurate specification details to record an item in the system database."
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Title Input */}
          <div className="md:col-span-2">
            <label className={labelClass}>Item Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Dell XPS 15 Laptop / HP Wireless Mouse"
              className={inputClass}
            />
          </div>

          {/* Status Selector */}
          <div>
            <label className={labelClass}>Report Status <span className="text-red-400">*</span></label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="LOST" className="bg-neutral-900 text-white">Lost (Item lost)</option>
              <option value="FOUND" className="bg-neutral-900 text-white">Found (Item found)</option>
              {isEdit && <option value="RETURNED" className="bg-neutral-900 text-white">Returned / Resolved</option>}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className={labelClass}>Category <span className="text-red-400">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="ELECTRONICS" className="bg-neutral-900 text-white">Electronics</option>
              <option value="DOCUMENTS" className="bg-neutral-900 text-white">Documents</option>
              <option value="KEYS" className="bg-neutral-900 text-white">Keys & Keychains</option>
              <option value="STATIONERY" className="bg-neutral-900 text-white">Stationery & Books</option>
              <option value="ACCESSORIES" className="bg-neutral-900 text-white">Accessories</option>
              <option value="OTHER" className="bg-neutral-900 text-white">Other</option>
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className={labelClass}>Campus Location <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Central Library, 2nd Floor"
                className={`${inputClass} pl-8`}
              />
              <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* Contact Number Input */}
          <div>
            <label className={labelClass}>Contact Number <span className="text-red-400">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                className={`${inputClass} pl-8 font-mono`}
              />
              <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="md:col-span-2">
            <label className={labelClass}>Specification / Description <span className="text-red-400">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide specific identifying marks, colors, serial details, or date/time when found or lost..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Image Uploader & Dropzone */}
          <div className="md:col-span-2">
            <label className={labelClass}>Attachment Photo (Optional)</label>
            
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-neutral-700 rounded-lg bg-neutral-950/50 hover:bg-neutral-900/60 hover:border-neutral-600 flex flex-col items-center justify-center p-6 gap-2.5 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-400">
                  <Upload size={16} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-neutral-200">
                    Click to attach item photo
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-normal">
                    Supported formats: JPG, PNG or WEBP (Max size: 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-h-64 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 flex items-center justify-center p-3">
                <img src={imagePreview} alt="Preview" className="max-h-56 w-auto object-contain rounded border border-neutral-800" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5 text-xs font-medium shadow"
                >
                  <X size={13} />
                  <span>Remove</span>
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
        <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/40 hover:bg-neutral-800 transition-colors disabled:opacity-50 border border-neutral-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 shadow-sm"
          >
            {submitting ? (
              <>
                <LoadingSpinner size={14} color="border-t-white border-white/30" />
                <span>Saving Record...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Record" : "Save & Publish"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
