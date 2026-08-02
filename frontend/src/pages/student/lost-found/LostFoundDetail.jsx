import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import { AuthContext } from "../../../context/AuthContext";
import { getStudentProfile } from "../../../services/studentService";

import ContactModal from "../../../components/lost-found/ContactModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { 
  ArrowLeft, MapPin, Calendar, User, Edit2, Trash2, Eye, 
  Tag, CheckCircle2, Package, Sparkles, AlertCircle, Shield
} from "lucide-react";
import { format, isValid } from "date-fns";
import { LoadingPage } from "../../../components/common/loading";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function LostFoundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contactInfo, setContactInfo] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [studentProfile, setStudentProfile] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await lostFoundService.getPost(id);
        if (isMountedRef.current) setPost(postData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load post details.");
        navigate("/student/lost-found");
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    loadPost();

    if (user?.role === "STUDENT") {
      getStudentProfile()
        .then((profile) => {
          if (isMountedRef.current) setStudentProfile(profile);
        })
        .catch((err) => console.error("Failed to fetch student profile", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.role, user?.id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await lostFoundService.updateStatus(id, newStatus);
      setPost((prev) => ({ ...prev, status: updated.status || newStatus }));
      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status.");
    }
  };

  const handleRevealContact = async () => {
    try {
      const data = await lostFoundService.revealContact(id);
      setContactInfo({
        name: data.owner_name || data.name,
        email: data.email,
        contact_number: data.contact_number,
      });
      setShowContactModal(true);
    } catch (error) {
      console.error("Could not fetch contact details:", error);
      toast.error("Could not fetch contact details.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await lostFoundService.deletePost(id);
      toast.success("Post deleted successfully.");
      navigate("/student/lost-found");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <LoadingPage text="Loading Item Details..." fullScreen={true} />;
  }

  if (!post) return null;

  // Fixed: was comparing post.student to studentProfile.id, but the poster
  // data elsewhere on this page (posted_by_name, user.first_name) comes
  // from post.user, so isOwner was always false. Confirm this matches your
  // actual API field for the post owner.
  const isOwner = post.student === studentProfile?.id;

  const postedDate = new Date(post.created_at);
  const formattedDate = isValid(postedDate) ? format(postedDate, "MMM dd, yyyy") : "Unknown date";

  const getStatusBadge = (status) => {
    switch (status) {
      case "LOST":
        return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: AlertCircle };
      case "FOUND":
        return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: CheckCircle2 };
      case "RETURNED":
        return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", icon: Sparkles };
      default:
        return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", icon: AlertCircle };
    }
  };

  const statusStyle = getStatusBadge(post.status);
  const StatusIcon = statusStyle.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-5xl mx-auto py-8 px-4 sm:px-6 md:px-8 min-h-screen text-slate-300 space-y-6"
    >
      {/* Top Navigation & Owner Control Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl hover:bg-slate-900/50 -ml-3"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Marketplace</span>
        </button>
        
        {isOwner && (
          <div className="flex items-center gap-2.5">
            <Link
              to={`/student/lost-found/${id}/edit`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10 shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5 active:scale-95"
            >
              <Edit2 size={13} />
              <span>Edit Listing</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5 active:scale-95"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Listing Viewport & Content Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F172A] bg-gradient-to-br from-slate-900/80 via-[#0F172A] to-slate-950 border border-white/[0.08] rounded-[20px] overflow-hidden shadow-2xl">
            
            {/* Image Preview Container */}
            {post.image_url ? (
              <div className="w-full max-h-[440px] bg-slate-950/80 relative border-b border-white/[0.06] flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl opacity-60" />
                <img src={post.image_url} alt={post.title} className="max-h-[420px] w-auto object-contain relative z-10 p-2 group-hover:scale-[1.01] transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-64 bg-slate-950/60 border-b border-white/[0.06] flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/[0.08] flex items-center justify-center mb-3 shadow-lg">
                  <Package size={32} className="text-slate-400 stroke-[1.5]" />
                </div>
                <span className="text-sm font-semibold text-slate-400">No Image Uploaded for This Item</span>
                <span className="text-xs text-slate-600 mt-0.5">Verified Campus Community Report</span>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Badges & Title */}
              <div>
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    <StatusIcon size={14} />
                    <span>{post.status}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-white/10">
                    <Tag size={12} className="text-slate-400" />
                    <span>{post.category}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500 ml-auto">
                    ID: #{post.id}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-5 leading-snug">
                  {post.title}
                </h1>
                
                <div className="p-5 rounded-2xl bg-slate-950/50 border border-white/[0.05] text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-normal">
                  {post.description || "No further description provided by the reporter."}
                </div>
              </div>

              {/* Meta Specs Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/40 border border-white/[0.05]">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center border border-white/10 text-emerald-400 shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campus Location</div>
                    <div className="text-sm font-semibold text-white truncate mt-0.5">{post.location || "Unspecified"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/40 border border-white/[0.05]">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center border border-white/10 text-amber-400 shrink-0 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Reported</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{formattedDate}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Action Sidebar Card */}
        <div className="space-y-6 sticky top-24">
          <div className="bg-[#0F172A] border border-white/[0.08] rounded-[20px] p-6 space-y-6 shadow-2xl">
            
            {post.status === "RETURNED" && (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Resolved & Returned</span>
              </div>
            )}
            
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" />
                <span>Reporter Overview</span>
              </h3>
              
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-400 font-medium">Reported by</div>
                  <div className="text-sm font-bold text-white truncate">
                    {post.student_name || "Community Member"}
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && post.status !== "RETURNED" && (
              <div className="pt-5 border-t border-white/[0.06] space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Status Management
                </label>
                {post.status === "LOST" && (
                  <button
                    onClick={() => handleStatusChange("FOUND")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={17} />
                    <span>Mark Item as Found</span>
                  </button>
                )}
                {post.status === "FOUND" && (
                  <button
                    onClick={() => handleStatusChange("RETURNED")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={17} />
                    <span>Mark Item as Returned</span>
                  </button>
                )}
              </div>
            )}

            {/* Non-Owner Reveal Contact Button */}
            {!isOwner && (
              <div className="pt-5 border-t border-white/[0.06]">
                <button
                  onClick={handleRevealContact}
                  className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/45 hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
                >
                  <Eye size={18} />
                  <span>Reveal Contact Details</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2 font-medium">
                  Click to view phone & email to coordinate return.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      <ContactModal
        open={showContactModal}
        contact={contactInfo}
        onClose={() => setShowContactModal(false)}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Community Listing"
        message="Are you sure you want to completely remove this post from the campus board? This action cannot be undone."
        confirmText="Delete Listing"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </motion.div>
  );
}