import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProfilePictureLink from "./ProfilePictureLink";

export default function PostHeader({ post, user, handleDeletePost, handleUpdatePost }) {
    const [showActions, setShowActions] = useState(false);
    const toggleDd = useRef(null);

    const toggleDropdown = () => setShowActions(!showActions);
    
    const isPostOwner = user?.id === post.user_id;
    console.log(post ,user);
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toggleDd.current && !toggleDd.current.contains(event.target)) {
                setShowActions(false); // Fix: Use setShowActions instead of toggleDropdown
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []); // Empty dependency array since toggleDd is a ref

    return (
        <div className="flex justify-between items-center mb-3 relative">
            <div className="flex items-center">
                <ProfilePictureLink name={post.user.profile.name} picture={post.user.profile.picture} userId={post.user_id} />
                <div className="ml-3">
                    <div className="font-bold ">{post.user.profile.name}</div>
                    <div className="text-xs text-gray-400 flex items-center">
                        {formatDistanceToNow(post.created_at, { addSuffix: true })}
                    </div>
                </div>
            </div>

            {isPostOwner && (
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        ref={toggleDd}
                        className="text-indigo-400 hover:text-indigo-600 transition-colors"
                        aria-label="Post actions"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {showActions && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <button
                                onClick={() => {
                                    setShowActions(false);
                                    handleUpdatePost(); // Trigger the update modal
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50"
                            >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                            </button>
                            <button
                                onClick={() => {
                                    setShowActions(false);
                                    handleDeletePost();
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-indigo-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
