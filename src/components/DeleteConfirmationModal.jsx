// File: components/Post/DeleteConfirmationModal.jsx

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useContext, useEffect } from "react";
import { deleteComment } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import { useParams } from "react-router";
import useUser from "../hooks/useUser";

export default function DeleteConfirmationModal({ commentToDelete, post, onClose }) {
    const queryClient = useQueryClient();
    const notify = useContext(NotificationContext);
    const { id } = useParams()
    const { data: currentUser } = useUser()
    const param = !id ? post.user_id : id
    console.log("param is " + param);

    const deleteCommentMutation = useMutation({
        mutationFn: ({ postId, commentId }) => deleteComment(postId, commentId),

        onMutate: async ({ postId, commentId }) => {
            await queryClient.cancelQueries(['posts']);
            await queryClient.cancelQueries(['profile', param]);
            await queryClient.cancelQueries(['post', String(postId)]);

            const previousPosts = queryClient.getQueryData(['posts']);
            const previousPost = queryClient.getQueryData(['post', String(postId)]);
            const previousProfileData = queryClient.getQueryData(['profile', param]);

            // Optimistically update single post
            queryClient.setQueryData(['post', String(postId)], (oldPost) => {
                if (!oldPost) return oldPost;
                return {
                    ...oldPost,
                    comments: oldPost.comments.filter(c => c.id !== commentId),
                    comments_count: oldPost.comments_count - 1,
                };
            });

            // Optimistically update posts list
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
                                    comments: post.comments.filter(c => c.id !== commentId),
                                    comments_count: post.comments_count - 1,
                                }
                                : post
                        ),
                    })),
                };
            });

            // Optimistically update profile posts
            queryClient.setQueryData(['profile', param], (oldProfile) => {
                if (!oldProfile) return oldProfile;
                return {
                    ...oldProfile,
                    posts: oldProfile.posts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                comments: post.comments.filter(c => c.id !== commentId),
                                comments_count: post.comments_count - 1,
                            }
                            : post
                    ),
                };
            });

            onClose();

            return { previousPosts, previousPost, previousProfileData };
        },

        onSuccess: () => {
            notify("success", "Comment removed successfully");
        },

        onError: (err, { postId }, context) => {
            queryClient.setQueryData(['posts'], context.previousPosts);
            queryClient.setQueryData(['post', String(postId)], context.previousPost);
            queryClient.setQueryData(['profile', param], context.previousProfileData);
            notify("error", "Failed to remove comment");
            console.error("Error deleting comment:", err);
        },

        onSettled: (_, __, context) => {
            const postId = context?.previousPost?.id;
            if (postId) {
                queryClient.invalidateQueries(['post', String(postId)]);
            }
            queryClient.invalidateQueries(['posts']);
            queryClient.invalidateQueries(['profile', param]);
        },
    });

    const confirmDelete = () => {
        console.log('Confirm delete triggered', { postId: post.id, commentId: commentToDelete, true: post.id && commentToDelete });
        // if (post.id && commentToDelete) {
        deleteCommentMutation.mutate({
            postId: post.id,
            commentId: commentToDelete
        });
        // } else {
        //     console.error('Invalid IDs');
        // }
    };

    // Close modal on Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onclose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 m-0 z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
        >
            <div
                className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl animate-fade-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 id="delete-confirm-title" className="text-lg font-semibold text-gray-800">
                        Delete Comment
                    </h3>
                </div>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this comment? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        aria-label="Cancel delete"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors flex items-center"
                        aria-label="Confirm delete"
                    >
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
