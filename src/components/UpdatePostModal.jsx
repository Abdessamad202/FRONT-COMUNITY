import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { NotificationContext } from "../context/NotificationContext";
import { updatePost } from "../api/apiCalls";
import { handleImageChange, handleInputChange } from "../utils/handlers";

export default function UpdatePostModal({ post, toggleModal }) {
  const queryClient = useQueryClient();
  const notify = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    content: post.content || "",
    image: null,
    imagePreview: post.image || "",
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, formData }) => updatePost(postId, formData),
    onMutate: async ({ postId, formData }) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId ? { ...p, content: formData.get("content") } : p
            ),
          })),
        };
      });
      return { previousPosts };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      notify("error", "Failed to update post");
      console.error("Update error:", err);
    },
    onSuccess: () => {
      notify("success", "Post updated successfully");
      toggleModal();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim() && !formData.image) {
      notify("error", "Please add content or an image to post.");
      return;
    }

    const data = new FormData();
    data.append("content", formData.content);
    if (formData.image) {
      data.append("image", formData.image);
    }

    updatePostMutation.mutate({
      postId: post.id,
      formData: data,
    });
  };

  const isFormValid = formData.content.trim() || formData.image;
  const isPending = updatePostMutation.isPending;

  const handleOverlayClick = (e) => {
    // Only close if the click is directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex m-0 justify-center items-center p-4 z-50"
      onClick={handleOverlayClick} // Close when clicking outside
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-post-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative animate-fade-scale"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Modal Header - Fixed at top */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 id="update-post-modal-title" className="text-lg font-semibold text-gray-800">
            Update Post
          </h3>
          <button
            onClick={toggleModal}
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            aria-label="Close update modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 p-5">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Content input */}
            <div>
              <label htmlFor="content" className="text-sm font-medium text-gray-700 mb-1 block">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={(e) => handleInputChange(e, setFormData)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="What's on your mind?"
                aria-label="Post content"
              />
            </div>

            {/* File input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Image</label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0], setFormData)}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none"
                  aria-label="Post image"
                />
              </div>

              {formData.imagePreview && (
                <div className="relative group">
                  <img
                    src={formData.imagePreview}
                    alt="Post preview"
                    className="rounded-lg object-cover w-full max-h-64 border border-gray-200"
                    onError={() => {
                      notify("error", "Failed to load image preview");
                      setFormData((prev) => ({ ...prev, imagePreview: "" }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: "" }))}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="rounded-xl p-5 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={toggleModal}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-70047 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isPending || !isFormValid}
                className={`px-5 py-2 rounded-md text-sm font-medium flex items-center ${
                  isFormValid && !isPending
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}