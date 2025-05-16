// File: components/Post/CommentItem.jsx
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationContext } from "../context/NotificationContext";
import { updateComment } from "../api/apiCalls";
import { useContext } from "react";
import { useParams } from "react-router";
import useUser from "../hooks/useUser";

const fallbackImage = "https://placehold.co/600x400?text=No+Image";

export default function CommentItem({
    comment,
    editingComment,
    setEditingComment,
    editedContent,
    setEditedContent,
    cancelEdit,
    openDeleteConfirm,
    post
}) {
    const queryClient = useQueryClient();
    const notify = useContext(NotificationContext);
    const { id } = useParams()
    const { data: currentUser } = useUser();
    // console.log("user" + comment.user.id);
    const param = !id ? post.user_id : id

    console.log(comment);

    // const isCommentOwner = comment.user?.id === currentUser?.id;
    const isPostOwner = post.user_id == currentUser?.id;
    const isCommentOwner = comment.user?.id === currentUser?.id;
    const updateCommentMutation = useMutation({
        mutationFn: ({ postId, commentId, data }) => updateComment(postId, commentId, data),

        onMutate: async ({ postId, commentId, data }) => {
            // Cancel ongoing queries to avoid race conditions
            await queryClient.cancelQueries(['posts']);
            await queryClient.cancelQueries(['profile', param]);
            await queryClient.cancelQueries(['post', String(postId)]);

            // Save the current data for rollback in case of failure
            const previousPosts = queryClient.getQueryData(['posts']);
            const previousPost = queryClient.getQueryData(['post', String(postId)]);
            const previousProfileData = queryClient.getQueryData(['profile', param]);

            // Optimistically update the posts data
            queryClient.setQueryData(['posts'], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((post) =>
                            post.id === postId
                                ? {
                                    ...post,
                                    comments: post.comments.map((c) =>
                                        c.id === commentId
                                            ? { ...c, content: data.content, updated_at: new Date().toISOString() }
                                            : c
                                    ),
                                    comments_count: post.comments_count || 0,
                                }
                                : post
                        ),
                    })),
                };
            });

            // Optimistically update the profile data
            queryClient.setQueryData(['profile', param], (oldProfile) => {
                if (!oldProfile) return oldProfile;

                return {
                    ...oldProfile,
                    posts: oldProfile.posts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                comments: post.comments.map(c =>
                                    c.id === commentId
                                        ? { ...c, content: data.content, updated_at: new Date().toISOString() }
                                        : c
                                ),
                                comments_count: post.comments_count || 0, // Ensure correct count
                            }
                            : post
                    ),
                };
            });

            // Optimistically update the specific post
            queryClient.setQueryData(['post', String(postId)], (oldPost) => {
                if (!oldPost) return oldPost;
                return {
                    ...oldPost,
                    comments: oldPost.comments.map((c) =>
                        c.id === commentId
                            ? { ...c, content: data.content, updated_at: new Date().toISOString() }
                            : c
                    ),
                    comments_count: oldPost.comments_count || 0,
                };
            });

            return { previousPosts, previousPost, previousProfileData };
        },

        onSuccess: () => {
            notify("success", "Comment updated successfully");
            cancelEdit();
        },

        onError: (err, _, context) => {
            // Rollback to previous state if the mutation fails
            queryClient.setQueryData(['posts'], context.previousPosts);
            queryClient.setQueryData(['post', String(context?.previousPost?.id)], context.previousPost);
            queryClient.setQueryData(['profile', param], context.previousProfileData);
            notify("error", "Failed to update comment");
            console.error("Error updating comment:", err);
        },

        onSettled: (_, __, context) => {
            const postId = context?.previousPost?.id;
            if (postId) {
                queryClient.invalidateQueries(['post', String(postId)]);
            }
            queryClient.invalidateQueries(['posts']);
            queryClient.invalidateQueries(['profile']);
        },
    });


    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditedContent(comment.content);
    };

    const handleUpdateComment = (e) => {
        e.preventDefault();
        if (!editedContent.trim()) return;

        updateCommentMutation.mutate({
            postId: post.id,
            commentId: editingComment,
            data: { content: editedContent }
        });
    };

    return (
        <div className="flex space-x-3">
            <img
                src={comment.user?.profile?.picture || fallbackImage}
                alt={`${comment?.user?.profile?.name || 'User'}'s avatar`}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
                <div className={`${isCommentOwner ? 'bg-indigo-50' : 'bg-gray-100'} p-3 rounded-2xl relative`}>
                    <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-800 text-sm flex items-center">
                            {comment.user?.profile?.name}
                            {isCommentOwner && (
                                <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                                    You
                                </span>
                            )}
                        </div>
                        <div className="flex space-x-1">
                            {isCommentOwner && (
                                <button
                                    onClick={() => handleEditComment(comment)}
                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                                    aria-label="Edit comment"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                </button>
                            )}
                            {(isPostOwner || isCommentOwner) && (
                                <button
                                    onClick={() => openDeleteConfirm(comment.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                                    aria-label="Delete comment"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                    </div>

                    {editingComment === comment.id ? (
                        <form onSubmit={handleUpdateComment} className="mt-2">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                rows="2"
                                placeholder="Edit your comment..."
                                aria-label="Edit comment"
                                autoFocus
                            />
                            <div className="flex justify-end mt-2 space-x-2">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!editedContent.trim()
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                        }`}
                                    disabled={!editedContent.trim()}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-1">
                            <p className="text-gray-700 text-sm break-words">{comment?.content}</p>
                            {comment?.created_at !== comment?.updated_at && (
                                <span className="text-xs text-gray-400 italic mt-1 block">(edited)</span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(comment?.created_at), { addSuffix: true })}</span>
                </div>
            </div>
        </div>
    );
}