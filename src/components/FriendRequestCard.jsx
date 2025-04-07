// File: components/FriendRequestCard.jsx
import { Check, X, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import FriendRequestButtons from "./FriendRequestButtons";
import ProfilePictureLink from "./ProfilePictureLink"; // Adjust the import path

const FriendRequestCard = ({ request, acceptMutation, rejectMutation }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-3">
                <ProfilePictureLink
                    userId={request.sender.id} // Assuming sender has an 'id' field
                    picture={request.sender.profile?.picture}
                    name={request.sender.profile?.name}
                />
                <div>
                    <p className="font-medium">{request.sender.profile.name}</p>
                    {request.mutualFriends > 0 && (
                        <p className="text-xs text-gray-500">{request.mutualFriends} mutual friends</p>
                    )}
                </div>
            </div>
            <FriendRequestButtons
                sender={request.sender.id}
                acceptMutation={acceptMutation}
                rejectMutation={rejectMutation}
            />
        </div>
    );
};

export default FriendRequestCard;