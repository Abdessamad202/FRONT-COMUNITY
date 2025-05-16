import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/apiCalls";
import Post from "./Post";
import { Loader2 } from "lucide-react";
import PostSkeleton from "./PostSkeleton";
import { Link } from "react-router";

export default function Posts() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        refetchOnWindowFocus: true,
    });

    const posts = data?.pages.flatMap((page) => page.posts) || [];

    // Handle error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 my-4">
                <h3 className="text-red-800 font-medium">Unable to load posts</h3>
                <div className="text-red-600 text-sm mt-1">Please try again later</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">

            {/* Loading Skeletons */}
            {isLoading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <PostSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Actual Posts */}
                    <div className="space-y-6">
                        <div className=" grid  gap-4 rounded-xl transition-all duration-300 hover:shadow-lg max-w-xl mx-auto grid-cols-1">

                            {posts.map((post, i) => (
                                <Post key={`post-${post.id || i}`} post={post} />
                            ))}
                        </div>
                    </div>

                    {/* Empty State */}
                    {posts.length === 0 && !isLoading && (
                        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl text-gray-400">📝</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                            <div className="text-gray-500 text-sm">Be the first to share something with your network</div>
                        </div>
                    )}

                    {/* Load More Section */}
                    {hasNextPage && (
                        <div className="flex justify-center mt-8 pb-8">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                            >
                                {isFetchingNextPage ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Loading
                                    </>
                                ) : (
                                    "Load More Posts"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Reached End State */}
                    {!hasNextPage && posts.length > 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm border-t border-gray-100 mt-8">
                            You've reached the end of your feed
                        </div>
                    )}
                </>
            )}
        </div>
    );
}