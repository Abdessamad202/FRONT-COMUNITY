import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, getPostLikers, toggleLikePost, fetchSavedPosts, toggleSavePost } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import useUser from "../hooks/useUser";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import CommentsModal from "./CommentsModal";
import UpdatePostModal from "./UpdatePostModal";
import LikesModal from "./LikesModal";
import { useParams } from "react-router";

export default function Post({ post }) {
    const queryClient = useQueryClient();
    const { data: user } = useUser();
    const notify = useContext(NotificationContext);

    // Audio effect
    const [likeSound] = useState(new Audio("/audios/mouth-plops-6688 (mp3cut.net).mp3"));
    const { id } = useParams()
    // Fetch post likers
    const { data: likers = [] } = useQuery({
        queryKey: ["postLikers", post.id],
        queryFn: () => getPostLikers(post.id),
    });

    // Fetch saved posts
    const { data: savedPosts = [] } = useQuery({
        queryKey: ["savedPosts"],
        queryFn: fetchSavedPosts,
    });

    // Post interaction states
    // const [likes, setLikes] = useState( || 0);
    // const [comments, setComments] = useState( || 0);

    // // Update state when props change
    // useEffect(() => {
    //     setLikes(post?.likes_count || 0);
    //     setComments(post?.comments_count || 0);
    // }, [post]);

    // Derive liked/saved state from query data
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setIsLiked(likers?.some(liker => liker.id === user?.id) || false);
    }, [likers, user]);
    useEffect(() => {
        setIsSaved(savedPosts?.some(saved => saved.id === post?.id) || false);
    }, [savedPosts, post]);

    // UI states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

    // Preload audio
    useEffect(() => {
        likeSound.load();
    }, [likeSound]);

    // Handle body scroll lock when any modal is open
    useEffect(() => {
        if (isModalOpen || isUpdateModalOpen || isLikesModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen, isUpdateModalOpen, isLikesModalOpen]);

    const likeMutation = useMutation({
        mutationFn: (postId) => toggleLikePost(postId),

        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["postLikers", postId] });
            await queryClient.cancelQueries({ queryKey: ["profile", id] });
            await queryClient.cancelQueries({ queryKey: ["post", String(postId)] });

            const previousPosts = queryClient.getQueryData(["posts"]);
            const previousLikers = queryClient.getQueryData(["postLikers", postId]);
            const previousProfileData = queryClient.getQueryData(["profile", id]);
            const previousPost = queryClient.getQueryData(["post", String(postId)]);

            // Optimistically update "posts"
            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.map((p) =>
                            p.id === postId
                                ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                                : p
                        ),
                    })),
                };
            });

            // Optimistically update "postLikers"
            queryClient.setQueryData(["postLikers", postId], (oldLikers = []) => {
                if (isLiked) {
                    return oldLikers.filter((liker) => liker.id !== user?.id);
                }
                return [
                    ...oldLikers,
                    {
                        id: user?.id,
                        name: user?.profile?.name,
                        picture: user?.profile?.picture,
                        friendship_status: "self",
                    },
                ];
            });

            // Optimistically update "profile"
            queryClient.setQueryData(["profile", id], (oldProfile) => {
                if (!oldProfile) return oldProfile;
                return {
                    ...oldProfile,
                    posts: oldProfile.posts.map((p) =>
                        p.id === postId
                            ? { ...p, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
                            : p
                    ),
                };
            });
            // Optimistically update single "post"

            queryClient.setQueryData(["post", String(postId)], (oldPost) => {
                if (!oldPost) return oldPost;
                return {
                    ...oldPost,
                    likes_count: isLiked ? oldPost.likes_count - 1 : oldPost.likes_count + 1,
                };
            });
            console.log("previousPost", previousPost);


            return { previousPosts, previousLikers, previousProfileData, previousPost };
        },

        onSuccess: (data) => {
            notify(data.status, data.message);
        },

        onError: (err, postId, context) => {
            queryClient.setQueryData(["posts"], context.previousPosts);
            queryClient.setQueryData(["postLikers", postId], context.previousLikers);
            queryClient.setQueryData(["profile", id], context.previousProfileData);
            queryClient.setQueryData(["post", String(postId)], context.previousPost);
            notify("error", "Failed to update like status");
            console.error("Error liking post:", err);
        },

        onSettled: (data, error, postId) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["postLikers", postId] });
            queryClient.invalidateQueries({ queryKey: ["profile", id] });
            queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
        },
    });


    const handleLike = () => {
        if (!user) return;

        likeMutation.mutate(post.id);

        if (!isLiked) {
            likeSound.play().catch((error) => console.error("Audio play error: ", error));
        }
    };

    const toggleSavePostMutation = useMutation({
        mutationFn: toggleSavePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["savedPosts"] });
            const previousSavedPosts = queryClient.getQueryData(["savedPosts"]);

            // Optimistic update
            queryClient.setQueryData(["savedPosts"], (oldData = []) => {
                if (isSaved) {
                    return oldData.filter(item => item.id !== postId);
                } else {
                    return [{ ...post, pivot: { created_at: new Date() } }, ...oldData];
                }
            });

            setIsSaved(!isSaved);
            return { previousSavedPosts };
        },
        onSuccess: (data) => {
            notify(data.status, data.message);
        },
        onError: (err, postId, context) => {
            queryClient.setQueryData(["savedPosts"], context.previousSavedPosts);
            setIsSaved(!isSaved); // Revert UI state
            notify("error", "Failed to toggle saved status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
        },
    });

    const handleSave = () => {
        if (!user) return;
        toggleSavePostMutation.mutate(post.id);
    };

    const toggleModal = () => setIsModalOpen((prev) => !prev);
    const toggleUpdateModal = () => setIsUpdateModalOpen((prev) => !prev);
    const toggleLikesModal = () => setIsLikesModalOpen((prev) => !prev);

    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData(["posts"]);

            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        posts: page.posts.filter((p) => p.id !== postId),
                    })),
                };
            });

            return { previousPosts };
        },
        onError: (err, _, context) => {
            notify("error", "Failed to delete post. Restoring...");
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSuccess: (data) => {
            notify(data.status, data.message || "Post deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const handleDeletePost = () => {
        if (!user || user.id !== post.user_id) return;
        deletePostMutation.mutate(post.id);
    };

    if (!post) return null;

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
            <PostHeader
                post={post}
                user={user}
                handleDeletePost={handleDeletePost}
                handleUpdatePost={toggleUpdateModal}
            />
            <div className="min-h-[200px] flex-grow">
                <PostContent post={post} />
            </div>
            <PostStats
                likes={post?.likes_count}
                comments={post?.comments_count}
                toggleModal={toggleModal}
                toggleLikesModal={toggleLikesModal}
            />
            <PostActions
                isLiked={isLiked}
                isSaved={isSaved}
                handleLike={handleLike}
                handleSave={handleSave}
                toggleModal={toggleModal}
            />
            {isModalOpen && (
                <CommentsModal
                    post={post}
                    comments={post?.comments_count}
                    toggleModal={toggleModal}
                />
            )}
            {isUpdateModalOpen && <UpdatePostModal post={post} toggleModal={toggleUpdateModal} />}
            {isLikesModalOpen && <LikesModal postId={post.id} toggleModal={toggleLikesModal} />}
        </div>
    );
}