import { useState, useContext } from "react";
import { useParams, Link } from "react-router"; // Fixed import typo
import {
  MapPin,
  Calendar,
  User,
  Edit,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Users,
  Component,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest, cancelFriendRequest, respondToFriendRequest, removeFriend } from "../api/apiCalls";
import { NotificationContext } from "../context/NotificationContext";
import useUser from "../hooks/useUser";
import Post from "../components/Post";
import ProfileEditModal from "../components/ProfileEditModal";
import FriendItem from "../components/FriendItem"; // Import FriendItem

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { id: userId } = useParams();
  const notify = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const { data: currentUser } = useUser();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useProfile(userId);
  console.log(user);

  const isOwnProfile = currentUser?.id == userId;

  // Friend request mutations
  const sendRequest = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      notify("success", "Friend request sent!");
      queryClient.invalidateQueries(["profile", userId]);
    },
    onError: (error) => notify("error", error.message || "Failed to send friend request"),
  });

  const cancelRequest = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      notify("success", "Friend request canceled!");
      queryClient.invalidateQueries(["profile", userId]);
    },
    onError: (error) => notify("error", error.message || "Failed to cancel friend request"),
  });

  const respondToRequest = useMutation({
    mutationFn: ({ userId, action }) => respondToFriendRequest(userId, action),
    onSuccess: (_, { action }) => {
      notify("success", `Friend request ${action === "accept" ? "accepted" : "rejected"}!`);
      queryClient.invalidateQueries(["profile", userId]);
    },
    onError: (error) => notify("error", error.message || "Failed to respond to friend request"),
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: (friendId) => removeFriend(friendId),
    onMutate: async (friendId) => {
      await queryClient.cancelQueries(["profile", userId]);
      const previousProfile = queryClient.getQueryData(["profile", userId]);

      queryClient.setQueryData(["profile", userId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          friends: oldData.friends.filter((friend) => friend.id !== friendId),
          friends_count: oldData.friends_count - 1, // Update friends count
        };
      });

      return { previousProfile };
    },
    onSuccess: () => {
      notify("success", "Friend removed successfully");
    },
    onError: (err, friendId, context) => {
      queryClient.setQueryData(["profile", userId], context.previousProfile);
      notify("error", "Failed to remove friend");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["profile", userId]);
    },
  });

  const handleFriendshipAction = (status) => {
    if (status === "none") sendRequest.mutate(userId);
    else if (status === "sent") cancelRequest.mutate(userId);
  };

  const renderFriendshipButton = () => {
    if (isLoading || !user || isOwnProfile) return null;

    const status = user.friendship_status || "none";
    const isPending = sendRequest.isPending || cancelRequest.isPending || respondToRequest.isPending;

    return (
      <div className="flex space-x-2">
        {status === "friend" && (
          <button
            className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-md font-medium border border-green-200"
            disabled
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Friends
          </button>
        )}
        {status === "sent" && (
          <button
            onClick={() => handleFriendshipAction("sent")}
            className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            <Clock className="w-4 h-4 mr-2" />
            {"Cancel Request"}
          </button>
        )}
        {status === "received" && (
          <>
            <button
              onClick={() => respondToRequest.mutate({ userId, action: "accept" })}
              className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {"Accept"}
            </button>
            <button
              onClick={() => respondToRequest.mutate({ userId, action: "reject" })}
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              <UserX className="w-4 h-4 mr-2" />
              {"Decline"}
            </button>
          </>
        )}
        {status === "none" && (
          <button
            onClick={() => handleFriendshipAction("none")}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {"Add Friend"}
          </button>
        )}
      </div>
    );
  };

  return (
    <main className="pt-20 pb-16 max-w-4xl mx-auto px-4">
      {/* Profile Header */}
      <section className="bg-white rounded-lg shadow-md mb-6">
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-t-lg" />
        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-14">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
              ) : user?.profile?.picture ? (
                <img
                  src={user.profile.picture}
                  alt={`${user.profile.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>
            {isOwnProfile ? (
              <Link
                onClick={() => setEditModalOpen(true)}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            ) : (
              renderFriendshipButton()
            )}
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {isLoading ? (
                <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
              ) : (
                <div className="flex items-center space-x-2">
                  <User
                    className={`w-5 h-5 ${user?.profile?.gender === "M"
                        ? "text-blue-600"
                        : user?.profile?.gender === "F"
                          ? "text-pink-600"
                          : "text-gray-600"
                      }`}
                  />
                  <span className="text-gray-900">{user?.profile?.name || "Unknown User"}</span>
                  {isOwnProfile && <span className="text-sm text-gray-500">(You)</span>}
                </div>
              )}
            </h1>
            <p className="text-gray-600 text-sm">
              {isLoading ? (
                <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                `@${user?.profile?.username || "username"}`
              )}
            </p>
            <p className="mt-2 text-gray-700 text-sm">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
                </div>
              ) : (
                user?.profile?.description || "No bio provided."
              )}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-gray-600 text-sm">
              {isLoading ? (
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
              ) : (
                <>
                  {user?.profile?.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      {user.profile.location}
                    </span>
                  )}
                  {user?.profile?.website && (
                    <span className="flex items-center">
                      <Link
                        to={user.profile.website}
                        className="flex items-center hover:text-indigo-600 transition-colors"
                      >
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {user.profile.website}
                      </Link>
                    </span>
                  )}
                  {user?.profile?.created_at && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-500 font-normal">Joined</span>
                      <span className="text-gray-900">{new Date(user.profile.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex space-x-6 mt-4 text-gray-800 font-medium text-sm">
              {isLoading ? (
                <>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-900">{user?.friends_count || 0}</span>
                    <span className="text-gray-500 font-normal">Friends</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Component className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-900">{user?.posts_count || 0}</span>
                    <span className="text-gray-500 font-normal">Posts</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs */}
      <nav className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          {["posts", "friends"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-gray-800"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Profile Content */}
      {activeTab === "posts" && (
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 animate-pulse space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-40 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md border border-red-200">
              <h3 className="text-lg font-medium text-red-600 mb-1">Error</h3>
              <p className="text-red-500 text-sm">{error.message || "Failed to load profile"}</p>
            </div>
          ) : user?.posts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.posts.map((post) => (
                <Link to={`/posts/${post.id}`}>
                  <Post key={`post-${post.id || i}`} post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Posts</h3>
              <p className="text-gray-600 text-sm">
                {isOwnProfile
                  ? "You haven’t posted anything yet."
                  : `${user.profile.name} hasn’t posted anything yet.`}
              </p>
            </div>
          )}
        </section>
      )}

      {activeTab === "friends" && (
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 animate-pulse space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md border border-red-200">
              <h3 className="text-lg font-medium text-red-600 mb-1">Error</h3>
              <p className="text-red-500 text-sm">{error.message || "Failed to load friends"}</p>
            </div>
          ) : user?.friends?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <FriendItem friend={friend} isOwnProfile={isOwnProfile} removeFriendMutation={isOwnProfile ? removeFriendMutation : null} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Friends</h3>
              <p className="text-gray-600 text-sm">
                {isOwnProfile
                  ? "You haven’t added any friends yet."
                  : `${user.profile.name} hasn’t added any friends yet.`}
              </p>
            </div>
          )}
        </section>
      )}

      {isOwnProfile && (
        <ProfileEditModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />
      )}
    </main>
  );
};

export default ProfilePage;