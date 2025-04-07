// components/FriendRequests.jsx
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests, respondToFriendRequest } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import { useContext } from "react";
import FriendRequestCard from "./FriendRequestCard";
import { Loader2 } from "lucide-react";

const FriendRequests = () => {
    const notify = useContext(NotificationContext);
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
        refetchOnWindowFocus: true,
    });

    const friendRequests = data?.pages.flatMap((page) => page.friendRequests) || [];

    const acceptMutation = useMutation({
        mutationFn: (sender) => respondToFriendRequest(sender, "accept"),
        onMutate: async (sender) => {
            await queryClient.cancelQueries(["friendRequests"]);
            const previousRequests = queryClient.getQueryData(["friendRequests"]);

            queryClient.setQueryData(["friendRequests"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        friendRequests: page.friendRequests?.filter((req) => req.sender.id !== sender) || [],
                    })),
                };
            });

            return { previousRequests };
        },
        onSuccess: (data) => {
            notify(data.status, data.message);
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(["friendRequests"], context.previousRequests);
            console.error("Error accepting request:", err);
            notify("error", "There was an issue accepting the request. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["friendRequests"]);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (sender) => respondToFriendRequest(sender, "reject"),
        onMutate: async (sender) => {
            await queryClient.cancelQueries(["friendRequests"]);
            const previousRequests = queryClient.getQueryData(["friendRequests"]);

            queryClient.setQueryData(["friendRequests"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        friendRequests: page.friendRequests?.filter((req) => req.sender.id !== sender) || [],
                    })),
                };
            });

            return { previousRequests };
        },
        onSuccess: (data) => {
            notify(data.status, data.message);
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(["friendRequests"], context.previousRequests);
            console.error("Error rejecting request:", err);
            notify("error", "There was an issue rejecting the request. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["friendRequests"]);
        }
    });

    return (
        <div className="bg-white rounded-lg shadow p-4 max-h-[calc(5*90px)] overflow-y-auto">
            <h2 className="font-semibold text-lg mb-4">Friend Requests</h2>

            {isLoading ? (
                <div>
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 animate-pulse"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                                <div>
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="py-4 text-center text-red-500">{error.message}</div>
            ) : friendRequests.length === 0 ? (
                <div className="py-4 text-center text-gray-500">No pending friend requests</div>
            ) : (
                <div>
                    {friendRequests.map((request, index) => (
                        <FriendRequestCard
                            key={index}
                            request={request}
                            acceptMutation={acceptMutation}
                            rejectMutation={rejectMutation}
                        />
                    ))}
                </div>
            )}

            {hasNextPage && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={fetchNextPage}
                        disabled={isFetchingNextPage}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        {isFetchingNextPage ? <Loader2 size={16} className="animate-spin" /> : "Load More"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FriendRequests;
