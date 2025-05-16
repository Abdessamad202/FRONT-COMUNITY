import { useState, useEffect, use } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Bookmark, Calendar, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Link } from "react-router";
import { fetchSavedPosts, toggleSavePost } from "../api/apiCalls";
import ProfilePictureLink from "./ProfilePictureLink";
import { UnsavePostButton } from "./SavedPostActions";

const SavedPostsModal = ({ toggleModal }) => {

  // Fetch saved posts
  const { data: savedPosts = [], isLoading, error } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: fetchSavedPosts,
  });
  // Handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  const formatSavedAt = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        exact: format(date, "MMM d, yyyy 'at' h:mm a"),
      };
    } catch (e) {
      return { relative: "Unknown time", exact: "Unknown time" };
    }
  };

  // Handle post unsave (would need to be implemented with toggleSavePost mutation)
  const handleUnsave = (postId) => {
    toggleSavePostMutation.mutate(postId)
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={toggleModal}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Saved Posts</h2>
          </div>
          <button
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleModal}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex p-4 border border-gray-100 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
                    <div className="h-20 bg-gray-100 rounded mb-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Failed to load saved posts. Please try again.</p>
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved posts yet</h3>
              <p className="text-gray-500">Posts you save will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {savedPosts.map((post) => {
                const savedTime = formatSavedAt(post.pivot.created_at || post.updated_at);

                return (
                  <div key={post.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    {/* Post author info */}
                    <div className="flex items-center mb-3">
                      <Link to={`/profile/${post.user_id}`} className="flex items-center">
                        <ProfilePictureLink name={post.user.profile.name} picture={post.user.profile.picture} userId={post.user_id} />
                        <div className="ml-2">
                          <p className="font-medium text-gray-900">
                            {post.user?.profile?.name || "Unknown User"}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </Link>

                      {/* Unsave button */}
                      <UnsavePostButton postId={post.id} />
                    </div>

                    {/* Post content summary */}
                    <Link to={`/posts/${post.id}`}>
                      <div className="mb-3">
                        <p className="text-gray-800 line-clamp-3">{post.content}</p>
                      </div>

                      {/* Post image if available */}
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden h-48">
                          <img
                            src={post.image}
                            alt="Post attachment"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                      )}

                      {/* Post stats */}
                      <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>{post.likes_count || 0} likes</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>{post.comments_count || 0} comments</span>
                        </div>

                        {/* Saved timestamp - new addition */}
                        <div className="flex items-center ml-auto" title={savedTime.exact}>
                          <Clock className="h-3 w-3 mr-1 text-indigo-500" />
                          <span className="text-indigo-500">Saved {savedTime.relative}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPostsModal;