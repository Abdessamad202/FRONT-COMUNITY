import { useState, useEffect, useContext } from "react";
import { X, Users } from "lucide-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationContext } from "../context/NotificationContext";
import { getFriends, removeFriend } from "../api/apiCalls";
import FriendItem from "./FriendItem"; // Import the new component

const fallbackImage = "https://placehold.co/600x400?text=No+Image";

export default function FriendsModal({ user, toggleModal }) {
  const queryClient = useQueryClient();
  const notify = useContext(NotificationContext);

  // Fetch friends data with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["friends", user.id],
    queryFn: getFriends,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? null,
    refetchOnWindowFocus: true,
  });

  // Flatten the paginated data into a single friends array
  const friends = data?.pages.flatMap((page) => page.friends) || [];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") toggleModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggleModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: (friendId) => removeFriend(friendId),
    onMutate: async (friendId) => {
      await queryClient.cancelQueries(["friends", user.id]);
      const previousFriends = queryClient.getQueryData(["friends", user.id]);

      queryClient.setQueryData(["friends", user.id], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            friends: page.friends.filter((friend) => friend.id !== friendId),
          })),
        };
      });

      return { previousFriends };
    },
    onSuccess: () => {
      notify("success", "Friend removed successfully");
    },
    onError: (err, friendId, context) => {
      queryClient.setQueryData(["friends", user.id], context.previousFriends);
      notify("error", "Failed to remove friend");
      console.error("Error removing friend:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["friends", user.id]);
    },
  });

  // Skeleton Loader Component
  const SkeletonFriend = () => (
    <div className="flex items-center space-x-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded-md" />
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={toggleModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="friends-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative animate-fade-scale"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 id="friends-modal-title" className="text-lg font-semibold text-gray-900">
            Friends ({friends.length})
          </h3>
          <button
            onClick={toggleModal}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close friends modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friends List */}
        <div className="p-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <SkeletonFriend key={index} />
                ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-sm">Failed to load friends</p>
              <p className="text-gray-500 text-xs mt-1">Please try again later</p>
            </div>
          ) : friends.length > 0 ? (
            <>
              <div className="space-y-4">
                {friends.map((friend) => (
                  <FriendItem
                    key={friend.id}
                    friend={friend}
                    removeFriendMutation={removeFriendMutation}
                  />
                ))}
              </div>
              {hasNextPage && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isFetchingNextPage
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-gray-600 text-sm">No friends yet</p>
              <p className="text-gray-500 text-xs mt-1">Connect with people to build your network</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}