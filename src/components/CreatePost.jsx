import { useContext, useState } from 'react';
import { X, Image } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationContext } from '../context/NotificationContext';
import useUser from '../hooks/useUser';
import { cn } from '../utils/cn';
import { createPost } from '../api/apiCalls';
import { handleImageChange, handleInputChange } from '../utils/handlers';

const CreatePost = () => {
  const { data: user, isLoading } = useUser();
  const [isDragging, setIsDragging] = useState(false);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);
  const notify = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    content: '',
    image: null,
    imagePreview: null,
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
    setIsDragging(false);
  };

  const toggleImageUpload = () => {
    setIsImageUploadVisible(!isImageUploadVisible);
    if (isImageUploadVisible) {
      setFormData((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
    }
  };

  const postMutation = useMutation({
    mutationFn: (data) => createPost(data),
    onMutate: async (newPostData) => {
      // Optimistic update: Cancel any outgoing refetches and update the cache immediately
      await queryClient.cancelQueries({ queryKey: ['posts', user?.id] });

      const previousPosts = queryClient.getQueryData(['posts', user?.id]) || [];

      // Create an optimistic post object
      const optimisticPost = {
        id: Date.now(), // Temporary ID
        content: newPostData.get('content'),
        image: formData.imagePreview, // Use preview for immediate display
        user: {
          id: user?.id,
          profile: user?.profile,
        },
        createdAt: new Date().toISOString(),
      };

      // Update the cache with the new post
      queryClient.setQueryData(['posts', user?.id], (old = []) => [optimisticPost, ...old]);

      notify("info", "Posting...");
      return { previousPosts }; // Return context for rollback on error
    },
    onSuccess: (data) => {
      // Replace the optimistic post with the real one from the server
      queryClient.setQueryData(['posts', user?.id], (old = []) => {
        const updatedPosts = old.map((post) =>
          post.id === Date.now() ? data.post : post
        );
        return updatedPosts;
      });
      notify("success", "Post created successfully!");
      setFormData({ content: '', image: null, imagePreview: null });
      setIsImageUploadVisible(false);
    },
    onError: (error, _variables, context) => {
      // Rollback to previous posts on error
      queryClient.setQueryData(['posts', user?.id], context.previousPosts);
      notify("error", error.message || "Failed to create post. Please try again.");
    },
    onSettled: () => {
      // Invalidate the query to refetch fresh data from the server
      queryClient.invalidateQueries({ queryKey: ['posts', user?.id] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim() && !formData.image) {
      notify("error", "Please add content or an image to post.");
      return;
    }

    const data = new FormData();
    data.append('content', formData.content);
    if (formData.image) {
      data.append('image', formData.image);
    }

    postMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
          {isLoading ? (
            <div className="w-full h-full animate-pulse bg-gray-300 rounded-full" />
          ) : (
            <img
              src={user?.profile?.picture || "/default-avatar.png"}
              alt={`${user?.profile?.name || "User"}'s profile`}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
          )}
        </div>
        <input
          name="content"
          type="text"
          value={formData.content}
          onChange={(e) => handleInputChange(e,setFormData)} // Fixed: Removed incorrect arrow function wrapper
          placeholder={isLoading ? "Loading..." : `What's on your mind, ${user?.profile?.name || "User"}?`}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Post content"
          disabled={postMutation.isPending} // Disable while posting
        />
      </div>

      {formData.imagePreview && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img
            src={formData.imagePreview}
            alt="Image preview"
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: null }))}
            className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1.5 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Remove image"
            disabled={postMutation.isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isImageUploadVisible && !formData.imagePreview && (
        <div
          className={cn(
            "mb-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
            isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50"
          )}
        >
          <Image className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Drag and drop an image here, or</p>
          <label className="mt-2 inline-block">
            <span className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium">
              browse to upload
            </span>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) => handleImageChange(e.target.files[0],setFormData)}
              className="hidden"
              aria-label="Upload image"
              disabled={postMutation.isPending}
            />
          </label>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={toggleImageUpload}
          className={cn(
            "flex items-center text-sm font-medium",
            isImageUploadVisible ? "text-indigo-600" : "text-gray-600",
            "hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
          )}
          aria-label="Toggle image upload"
          disabled={postMutation.isPending}
        >
          <Image className="w-5 h-5 mr-2" />
          Photo
        </button>
        <button
          type="submit"
          disabled={
            postMutation.isPending ||
            (!formData.content.trim() && !formData.image)
          }
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {postMutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;