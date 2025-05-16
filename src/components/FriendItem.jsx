import ProfilePictureLink from "./ProfilePictureLink";

export default function FriendItem({ friend, removeFriendMutation, isOwnProfile }) {
  const handleRemoveFriend = () => {
    removeFriendMutation.mutate(friend.id);
  };

  return (
    <div className="flex items-center space-x-3">
      <ProfilePictureLink
        userId={friend.id}
        picture={friend.profile.picture}
        name={friend.profile.name}
      />
      <div className="flex-1">
        <p className="text-gray-900 font-medium text-sm">
          {friend.profile?.name || "Unknown"}
        </p>
        {friend.profile?.title && (
          <p className="text-gray-600 text-xs">{friend.profile.title}</p>
        )}
      </div>
      {isOwnProfile && (
        <button
          onClick={handleRemoveFriend}
          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors"
          disabled={
            removeFriendMutation.isLoading && removeFriendMutation.variables === friend.id
          }
          aria-label={`Remove ${friend.profile?.name || "friend"}`}
        >
          {removeFriendMutation.isLoading && removeFriendMutation.variables === friend.id
            ? "Removing..."
            : "Remove"}
        </button>

      )}
    </div>
  );
}