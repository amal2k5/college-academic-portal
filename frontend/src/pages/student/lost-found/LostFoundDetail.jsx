import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import { AuthContext } from "../../../context/AuthContext";
import { getStudentProfile } from "../../../services/studentService";

import ContactModal from "../../../components/lost-found/ContactModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { 
  ArrowLeft, MapPin, Calendar, User, Edit2, Trash2, Eye, 
  Tag, CheckCircle2, Package
} from "lucide-react";
import { format, isValid } from "date-fns";
import { LoadingPage } from "../../../components/common/loading";

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
        return { bg: "bg-amber-500/5", text: "text-amber-400", border: "border-amber-500/30" };
      case "FOUND":
        return { bg: "bg-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/30" };
      case "RETURNED":
      case "CLAIMED":
        return { bg: "bg-blue-500/5", text: "text-blue-400", border: "border-blue-500/30" };
      default:
        return { bg: "bg-neutral-800/40", text: "text-neutral-400", border: "border-neutral-600" };
    }
  };

  const statusStyle = getStatusBadge(post.status);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 md:px-8 min-h-screen text-neutral-300 space-y-6">
      {/* Top Navigation & Owner Control Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors py-1 rounded-lg"
        >
          <ArrowLeft size={15} />
          <span>Back to Lost & Found</span>
        </button>
        
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/student/lost-found/${id}/edit`}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors border border-neutral-700 flex items-center gap-1.5"
            >
              <Edit2 size={13} />
              <span>Edit Listing</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-red-500/10 text-red-400 border border-red-500/40 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
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
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            
            {/* Title & Header Bar */}
            <div className="p-6 border-b border-neutral-800/60 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                  <span>{post.status}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                  <Tag size={11} className="text-neutral-400" />
                  <span>{post.category}</span>
                </span>
                <span className="text-xs font-mono text-neutral-500 ml-auto">
                  ID: #{post.id}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug">
                {post.title}
              </h1>
            </div>

            {/* Image Preview Container */}
            {post.image_url ? (
              <div className="w-full bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-center p-4 max-h-[400px] overflow-hidden">
                <img src={post.image_url} alt={post.title} className="max-h-[360px] w-auto object-contain rounded-lg border border-neutral-800" />
              </div>
            ) : (
              <div className="w-full h-44 bg-neutral-950/50 border-b border-neutral-800/60 flex flex-col items-center justify-center text-neutral-500 gap-2">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Package size={20} className="text-neutral-500" />
                </div>
                <span className="text-xs font-medium text-neutral-400">No Image Provided</span>
              </div>
            )}

            {/* Description Body */}
            <div className="p-6 space-y-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Item Description</div>
              <div className="p-4 rounded-lg bg-neutral-950/60 border border-neutral-800/80 text-neutral-300 leading-relaxed text-sm whitespace-pre-wrap font-normal">
                {post.description || "No further description provided by the reporter."}
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar Card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-5 shadow-sm">
            
            {post.status === "RETURNED" && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span>Item has been marked as returned</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider border-b border-neutral-800 pb-2.5 flex items-center gap-1.5">
                <span>Record Information</span>
              </h3>
              
              <div className="space-y-3 divide-y divide-neutral-800/50 text-xs">
                <div className="flex items-center justify-between pt-2 first:pt-0">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <User size={13} className="text-neutral-500 shrink-0" />
                    Reporter
                  </span>
                  <span className="font-medium text-white max-w-[180px] truncate">
                    {post.student_name || "Community Member"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <MapPin size={13} className="text-neutral-500 shrink-0" />
                    Location
                  </span>
                  <span className="font-medium text-white max-w-[180px] truncate">
                    {post.location || "Unspecified"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-500 shrink-0" />
                    Reported Date
                  </span>
                  <span className="font-medium text-neutral-300 font-mono">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {isOwner && post.status !== "RETURNED" && (
              <div className="pt-4 border-t border-neutral-800 space-y-2.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  Status Action
                </label>
                {post.status === "LOST" && (
                  <button
                    onClick={() => handleStatusChange("FOUND")}
                    className="w-full py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 size={15} />
                    <span>Mark Item as Found</span>
                  </button>
                )}
                {post.status === "FOUND" && (
                  <button
                    onClick={() => handleStatusChange("RETURNED")}
                    className="w-full py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 size={15} />
                    <span>Mark Item as Returned</span>
                  </button>
                )}
              </div>
            )}

            {/* Non-Owner Reveal Contact Button */}
            {!isOwner && (
              <div className="pt-4 border-t border-neutral-800">
                <button
                  onClick={handleRevealContact}
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-2 shadow-sm"
                >
                  <Eye size={15} />
                  <span>Reveal Contact Details</span>
                </button>
                <p className="text-[11px] text-neutral-500 text-center mt-2">
                  View phone number & email address.
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
        title="Delete Item Record"
        message="Are you sure you want to permanently remove this lost and found record? This action cannot be undone."
        confirmText="Delete Record"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}