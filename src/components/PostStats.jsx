import { ThumbsUp, MessageCircle } from "lucide-react";

export default function PostStats({ likes, comments, toggleModal, toggleLikesModal }) {
    return (
        <div className="flex justify-between text-xs text-indigo-500 mt-2 pb-3 border-b border-gray-200">
            {/* Likes Button (Yellow) */}
            <button
                onClick={toggleLikesModal}
                className="flex items-center px-3 py-1.5 rounded-lg transition duration-200 text-sm font-medium hover:bg-indigo-100 cursor-pointer"
                aria-label="View who liked this post"
            >
                <div className="bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-white" />
                </div>
                <span className="ml-2">{likes}</span>
            </button>

            {/* Comments Button (Gray) */}
            <button
                className="flex cursor-pointer items-center px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200 text-sm font-medium"
                onClick={toggleModal}
                aria-label="View comments"
            >
                <MessageCircle className="w-4 h-4 mr-2 text-gray-600" />
                <span>{comments}</span>
            </button>
        </div>
    );
}
