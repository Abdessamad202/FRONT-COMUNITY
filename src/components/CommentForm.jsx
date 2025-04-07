import { handleInputChange } from "../utils/handlers";

// CommentForm.jsx
const fallbackImage = "https://placehold.co/600x400?text=No+Image";

export function CommentForm({
    user,
    comment,
    setComment,
    handleCommentSubmit,
    addCommentMutation,
}) {
    console.log(user);
    
    return (
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white shadow-md">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
                <img
                    className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0 border border-gray-200"
                    src={user?.profile?.picture || fallbackImage}
                    alt="Your avatar"
                />
                <div className="flex-1 relative">
                    <input
                        type="text"
                        name="content"
                        value={comment.content}
                        onChange={(e) => handleInputChange(e, setComment)}
                        placeholder="Write a comment..."
                        className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm border border-transparent"
                        aria-label="Comment text"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!comment?.content.trim() || addCommentMutation.isLoading}
                    className={`ml-2 p-2 rounded-full flex items-center justify-center transition-colors ${comment?.content.trim() && !addCommentMutation.isLoading
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    aria-label="Submit comment"
                >
                    {addCommentMutation.isLoading ? (
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}