import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useCallback, useMemo } from "react";
import ProfilePictureLink from "./ProfilePictureLink";
import { sendFriendRequest, cancelFriendRequest, respondToFriendRequest, getPostLikers } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import useUser from "../hooks/useUser";

// Button configuration constants
const BUTTON_CONFIG = {
  friend: { text: "Friend", style: "cursor-pointer px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-600 hover:text-green-50 rounded-md transition-colors", disabled: true },
  sent: { text: "Cancel Request", style: "cursor-pointer px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors" },
  received: {
    accept: { text: "Accept", style: "cursor-pointer px-3 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-600 hover:text-green-50 rounded-md transition-colors" },
    reject: { text: "Reject", style: "cursor-pointer px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors" }
  },
  none: { text: "Add Friend", style: "cursor-pointer px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-indigo-50 rounded-md transition-colors" },
};

/**
 * Modal component to display users who liked a post with friend request functionality
 * @param {string} postId - ID of the post to show likers for
 * @param {function} toggleModal - Function to toggle modal visibility
 */
export default function LikesModal({ postId, toggleModal }) {
  const notify = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { data: currentUser } = useUser();

  // Fetch post likers
  const { data: likers = [], isLoading, error } = useQuery({
    queryKey: ["postLikers", postId],
    queryFn: () => getPostLikers(postId),
  });

  // Enhanced likers list with current user
  const enhancedLikers = useMemo(() => {
    if (!currentUser) return likers;

    // Check if current user is already in the likers list
    const currentUserInList = likers.some(liker => liker.id === currentUser.id);

    // Only add current user if they liked the post and aren't already in the list
    if (currentUser.likedPosts?.includes(postId) && !currentUserInList) {
      return [...likers, {
        id: currentUser.id,
        picture: currentUser.profile.picture,
        name: currentUser.name || currentUser.profile.name,
        friendship_status: "self"
      }];
    }

    return likers;
  }, [likers, currentUser, postId]);

  // Generic mutation factory
  const createMutation = useCallback((mutationFn, successMessage, errorMessage, newStatus) => ({
    mutationFn,
    onMutate: async (userId) => {
      await queryClient.cancelQueries(["postLikers", postId]);
      const previousLikers = queryClient.getQueryData(["postLikers", postId]);
      queryClient.setQueryData(["postLikers", postId], old =>
        old.map(liker => liker.id === userId ? { ...liker, friendship_status: newStatus } : liker)
      );
      return { previousLikers };
    },
    onSuccess: () => notify("success", successMessage),
    onError: (err, userId, context) => {
      queryClient.setQueryData(["postLikers", postId], context.previousLikers);
      notify("error", err.message || errorMessage);
    },
    onSettled: () => queryClient.invalidateQueries(["postLikers", postId]),
  }), [queryClient, notify, postId]);

  // Friend request mutations
  const mutations = {
    send: useMutation(createMutation(
      sendFriendRequest,
      "Friend request sent!",
      "Failed to send friend request",
      "sent"
    )),
    cancel: useMutation(createMutation(
      cancelFriendRequest,
      "Friend request canceled!",
      "Failed to cancel friend request",
      "none"
    )),
    accept: useMutation(createMutation(
      userId => respondToFriendRequest(userId, "accept"),
      "Friend request accepted!",
      "Failed to accept friend request",
      "friend"
    )),
    reject: useMutation(createMutation(
      userId => respondToFriendRequest(userId, "reject"),
      "Friend request rejected!",
      "Failed to reject friend request",
      "none"
    )),
  };

  // Friend request action handler
  const handleFriendRequest = useCallback((userId, status, action = "accept") => {
    const actions = {
      sent: () => mutations.cancel.mutate(userId),
      received: () => action === "accept"
        ? mutations.accept.mutate(userId)
        : mutations.reject.mutate(userId),
      none: () => mutations.send.mutate(userId),
      friend: () => console.log("Already friends") // No action needed
    };

    if (actions[status]) {
      actions[status]();
    } else {
      console.error(`Unhandled friendship status: ${status}`);
    }
  }, [mutations]);

  // Get button properties
  const getButtonProps = (liker) => {
    if (liker.friendship_status === "self") return null;

    let config = BUTTON_CONFIG[liker.friendship_status || "none"];
    if (liker.friendship_status === "received") {
      return {
        accept: { ...BUTTON_CONFIG.received.accept },
        reject: { ...BUTTON_CONFIG.received.reject },
      };
    }

    const activeMutation = Object.values(mutations).find(m => m.variables === liker.id && m.isPending);
    return {
      ...config,
      text: config.text,
      disabled: config.disabled || !!activeMutation,
    };
  };

  // Render liker item
  const renderLiker = (liker) => {
    const buttonProps = getButtonProps(liker);

    return (
      <li key={liker.id} className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <ProfilePictureLink userId={liker.id} picture={liker.picture} name={liker.name} />
          <span className="text-gray-800 font-medium ml-3">
            {liker.name} {liker.friendship_status === "self" && "(You)"}
          </span>
        </div>
        {buttonProps && (
          liker.friendship_status === "received" ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleFriendRequest(liker.id, liker.friendship_status, "accept")}
                disabled={buttonProps.accept.disabled}
                className={buttonProps.accept.style}
                aria-label={`Accept friend request from ${liker.name}`}
              >
                {buttonProps.accept.text}
              </button>
              <button
                onClick={() => handleFriendRequest(liker.id, liker.friendship_status, "reject")}
                disabled={buttonProps.reject.disabled}
                className={buttonProps.reject.style}
                aria-label={`Reject friend request from ${liker.name}`}
              >
                {buttonProps.reject.text}
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleFriendRequest(liker.id, liker.friendship_status)}
              disabled={buttonProps.disabled}
              className={buttonProps.style}
              aria-label={`${buttonProps.text} ${liker.name}`}
            >
              {buttonProps.text}
            </button>
          )
        )}
      </li>
    );
  };

  return (
    <div
      className="fixed inset-0 m-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={toggleModal}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative animate-fade-scale"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-800">Liked by</h3>
          <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </header>

        <section className="p-4">
          {isLoading && <div className="text-center text-gray-500 py-4">Loading likes...</div>}
          {error && <div className="text-center text-red-500 py-4">Failed to load likes</div>}
          {!isLoading && !error && enhancedLikers.length === 0 && (
            <div className="text-center text-gray-500 py-4">No likes yet</div>
          )}
          {!isLoading && enhancedLikers.length > 0 && (
            <ul className="space-y-3">{enhancedLikers.map(renderLiker)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}