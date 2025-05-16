import { useState, useEffect, useContext, useRef } from "react"; // Added useRef
import { X, MessageCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import { handleInputChange } from "../utils/handlers";
import CommentItem from "./CommentItem";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useParams } from "react-router";
import useUser from "../hooks/useUser";

const fallbackImage = "https://placehold.co/600x400?text=No+Image";

export default function CommentsModal({ post, comments, toggleModal }) {
  const queryClient = useQueryClient();
  const notify = useContext(NotificationContext);
  const commentsContainerRef = useRef(null); // Ref for the comments container
  const { data: currentUser } = useUser();
  const [comment, setComment] = useState({ content: "" });
  const [editingComment, setEditingComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { id } = useParams()
  const param = !id ? post.user.id : id
  const { data: user } = useUser()
  console.log("param", param, user.id);


  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        toggleModal();
        setShowDeleteConfirm(false);
        cancelEdit();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggleModal]);

  useEffect(() => {
    if (showDeleteConfirm || editingComment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showDeleteConfirm, editingComment]);

  useEffect(() => {
    cancelEdit();
  }, []);

  // Scroll to the bottom when the modal opens or new comments are added
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [post.comments]); // Trigger on comments change

  const addCommentMutation = useMutation({
    mutationFn: ({ postId, data }) => addComment(postId, data),

    onMutate: async ({ postId, data }) => {
      // Cancel ongoing queries to avoid race conditions
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["post", String(postId)]);
      await queryClient.cancelQueries(["profile", param]);

      // Save the current data for rollback in case of failure
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousSinglePost = queryClient.getQueryData(["post", String(postId)]);
      const previousProfileData = queryClient.getQueryData(["profile", param]);
      // console.log(previousSinglePost);
      
      // Optimistic comment data
      const optimisticComment = {
        content: data.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: currentUser.id,
          profile: {
            picture: currentUser.profile.picture,
            name: currentUser.profile.name,
          },
        },
      };

      // Optimistically update posts feed
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId
                ? {
                  ...p,
                  comments: [...p.comments, optimisticComment],
                  comments_count: (p.comments_count || 0) + 1,
                }
                : p
            ),
          })),
        };
      });

      // Optimistically update the single post
      queryClient.setQueryData(["post", String(postId)], (oldPost) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          comments: [...oldPost.comments, optimisticComment],
          comments_count: (oldPost.comments_count || 0) + 1,
        };
      });

      // Optimistically update profile data
      queryClient.setQueryData(["profile", param], (oldProfile) => {
        if (!oldProfile) return oldProfile;

        return {
          ...oldProfile,
          posts: oldProfile.posts.map((post) =>
            post.id === postId
              ? {
                ...post,
                comments: [...post.comments, optimisticComment],
                comments_count: (post.comments_count || 0) + 1,
              }
              : post
          ),
        };
      });

      return { previousPosts, previousSinglePost, previousProfileData, postId };
    },

    onSuccess: () => {
      notify("success", "Comment added successfully");
    },

    onError: (err, _, context) => {
      // Rollback to previous state if the mutation fails
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousSinglePost) {
        queryClient.setQueryData(["post", context.previousSinglePost.id], context.previousSinglePost);
      }
      if (context?.previousProfileData) {
        queryClient.setQueryData(["profile", param], context.previousProfileData);
      }
      notify("error", "Failed to add comment");
      console.error("Error adding comment:", err);
    },

    onSettled: ({ postId }) => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries(["posts"]);
      if (postId) {
        queryClient.invalidateQueries(['post', String(postId)]);
      }
      queryClient.invalidateQueries(["profile"]);
    },
  });




  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.content.trim()) return;

    addCommentMutation.mutate({ postId: post.id, data: comment });
    setComment((prev) => ({ ...prev, content: "" }));
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditedContent("");
  };

  const openDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCommentToDelete(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 m-0 backdrop-blur-sm flex justify-center items-center p-4 z-50"
        onClick={toggleModal}
        role="dialog"
        
        aria-modal="true"
        aria-labelledby="comments-modal-title"
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative animate-fade-scale"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 id="comments-modal-title" className="text-lg font-semibold text-gray-900">
              Comments ({comments})
            </h3>
            <button
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close comments"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            ref={commentsContainerRef} // Attach ref to the scrollable container
            className="p-4 max-h-[calc(90vh-8rem)] overflow-y-auto"
          >
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment, i) => (
                  <CommentItem
                    key={i}
                    comment={comment}
                    editingComment={editingComment}
                    setEditingComment={setEditingComment}
                    editedContent={editedContent}
                    setEditedContent={setEditedContent}
                    cancelEdit={cancelEdit}
                    openDeleteConfirm={openDeleteConfirm}
                    post={post}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-gray-600 text-sm">No comments yet</p>
                <p className="text-gray-500 text-xs">Be the first to share your thoughts</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white shadow-md">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <img
                className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0 border border-gray-200"
                src={currentUser.profile.picture || fallbackImage}
                alt="Your avatar"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="content"
                  value={comment.content}
                  onChange={(e) => handleInputChange(e, setComment)}
                  placeholder="Write a comment..."
                  className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm border border-transparent"
                  aria-label="Comment text"
                />
              </div>
              <button
                type="submit"
                disabled={!comment?.content.trim() || addCommentMutation.isLoading}
                className={`ml-2 p-2 rounded-full flex items-center justify-center transition-colors ${comment?.content.trim() && !addCommentMutation.isLoading
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                aria-label="Submit comment"
              >
                {addCommentMutation.isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          post={post}
          commentToDelete={commentToDelete}
          onClose={closeDeleteConfirm}
        />
      )}
    </>
  );
}