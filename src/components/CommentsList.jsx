// CommentsList.jsx
import { MessageCircle } from "lucide-react";
import CommentItem from "./CommentItem";

export function CommentsList({
  post,
  user,
  editingComment,
  setEditingComment,
  editedContent,
  setEditedContent,
  cancelEdit,
  openDeleteConfirm,
  commentsContainerRef,
}) {
  return (
    <div
      ref={commentsContainerRef}
      className="p-4 max-h-[calc(90vh-8rem)] overflow-y-auto"
    >
      {post.comments && post.comments.length > 0 ? (
        <div className="space-y-4">
          {post.comments.map((comment, i) => (
            <CommentItem
              key={comment.id || i}
              comment={comment}
              user={user}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              cancelEdit={cancelEdit}
              openDeleteConfirm={openDeleteConfirm}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-gray-600 text-sm">No comments yet</p>
          <p className="text-gray-500 text-xs">Be the first to share your thoughts</p>
        </div>
      )}
    </div>
  );
}