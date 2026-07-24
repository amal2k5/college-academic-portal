import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import lostFoundService from "../../../services/lostFoundService";
import { AuthContext } from "../../../context/AuthContext";
import PageHeader from "../../../components/common/PageHeader";
import ContactModal from "../../../components/lost-found/ContactModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { ArrowLeft, MapPin, Calendar, User, Edit2, Trash2, Eye, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LostFoundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  
  const [contactInfo, setContactInfo] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPostAndComments = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        lostFoundService.getPost(id),
        lostFoundService.getComments(id).catch(() => [])
      ]);
      setPost(postData);
      setComments(Array.isArray(commentsData) ? commentsData : commentsData.results || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load post details.");
      navigate("/student/lost-found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostAndComments();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const updated = await lostFoundService.updateStatus(id, newStatus);
      setPost(prev => ({ ...prev, status: updated.status || newStatus }));
      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleRevealContact = async () => {
    try {
      const data = await lostFoundService.revealContact(id);
      setContactInfo(data);
      setShowContactModal(true);
    } catch (error) {
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
      toast.error("Failed to delete post.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      await lostFoundService.addComment(id, commentText);
      setCommentText("");
      const commentsData = await lostFoundService.getComments(id);
      setComments(Array.isArray(commentsData) ? commentsData : commentsData.results || []);
      toast.success("Comment added.");
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neutral-700 border-t-emerald-500 rounded-full animate-spin"></div></div>;
  }

  if (!post) return null;

  // Assume user is owner if user ID matches post.user (could be user object or ID)
  // or if post.is_owner is true
  const isOwner = post.is_owner || 
                  post.user?.id === user?.id || 
                  post.user === user?.id || 
                  post.posted_by?.id === user?.id;

  const getStatusBadge = (status) => {
    switch (status) {
      case "LOST": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "FOUND": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "RETURNED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-5xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-300 space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to List
        </button>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link 
              to={`/student/lost-found/${id}/edit`}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            {post.image ? (
              <div className="w-full h-80 bg-neutral-950 relative border-b border-neutral-800">
                <img src={post.image} alt={post.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-40 bg-neutral-950 border-b border-neutral-800 flex items-center justify-center text-neutral-600">
                No Image Available
              </div>
            )}
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{post.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${getStatusBadge(post.status)}`}>
                    {post.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">{post.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800">
                    <MapPin size={18} className="text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Location</div>
                    <div className="text-sm font-medium text-white">{post.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800">
                    <Calendar size={18} className="text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Date Posted</div>
                    <div className="text-sm font-medium text-white">
                      {format(new Date(post.created_at), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Action Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Post Details</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                  <User size={18} className="text-neutral-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Posted by</div>
                  <div className="text-sm font-medium text-white">{post.posted_by_name || post.user?.first_name || "Unknown"}</div>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="pt-4 border-t border-neutral-800">
                <label className="text-xs font-medium text-neutral-400 block mb-2">Update Status</label>
                <select
                  value={post.status}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white"
                >
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                  <option value="RETURNED">Returned</option>
                </select>
              </div>
            )}

            {!isOwner && (
              <button
                onClick={handleRevealContact}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
              >
                <Eye size={16} />
                Reveal Contact
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col max-h-[500px]">
            <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
              <MessageSquare size={16} className="text-neutral-400" />
              <h3 className="text-sm font-medium text-white">Comments ({comments.length})</h3>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4 min-h-[200px]">
              {comments.length === 0 ? (
                <div className="text-center text-sm text-neutral-500 py-8">No comments yet.</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-emerald-400">{comment.author_name || comment.user?.first_name || "User"}</span>
                      <span className="text-[10px] text-neutral-500">{format(new Date(comment.created_at), "MMM dd, HH:mm")}</span>
                    </div>
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handlePostComment} className="p-3 border-t border-neutral-800 bg-neutral-950/50 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-sm text-white"
              />
              <button
                type="submit"
                disabled={postingComment || !commentText.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
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
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </motion.div>
  );
}
