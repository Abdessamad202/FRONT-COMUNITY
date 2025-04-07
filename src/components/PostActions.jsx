import { ThumbsUp, MessageCircle, Bookmark } from "lucide-react";

export default function PostActions({ isLiked, isSaved, handleLike, handleSave, toggleModal }) {
    return (
        <div className="flex justify-between items-center pt-3">
            {/* Like Button */}
            <button
                className={`flex items-center px-3 py-1.5 rounded-lg transition duration-200 text-sm font-medium cursor-pointer ${
                    isLiked ? "bg-indigo-100 text-indigo-600" : "text-indigo-600 hover:bg-indigo-100"
                }`}
                onClick={handleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
            >
                <ThumbsUp className={`w-4 h-4 sm:mr-2 ${isLiked ? "fill-indigo-600 text-indigo-600" : ""}`} />
                <div className="hidden sm:block">{isLiked ? "Liked" : "Like"}</div>
            </button>

            {/* Comment Button */}
            <button
                className="flex cursor-pointer items-center px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-200 text-sm font-medium"
                onClick={toggleModal}
                aria-label="Add comment"
            >
                <MessageCircle className="w-4 h-4 sm:mr-2" />
                <div className="hidden sm:block">Comment</div>
            </button>

            {/* Save Button */}
            <button
                className={`flex cursor-pointer items-center px-3 py-1.5 rounded-lg transition duration-200 text-sm font-medium ${
                    isSaved ? "bg-yellow-100 text-yellow-600" : "text-yellow-600 hover:bg-yellow-100"
                }`}
                onClick={handleSave}
                aria-label={isSaved ? "Unsave post" : "Save post"}
            >
                <Bookmark className={`w-4 h-4 sm:mr-2 ${isSaved ? "fill-yellow-600 text-yellow-600" : ""}`} />
                <div className="hidden sm:block">{isSaved ? "Saved" : "Save"}</div>
            </button>
        </div>
    );
}
