import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSavePost } from "../api/apiCalls";

const UnsavePostButton = ({ postId }) => {
  const queryClient = useQueryClient();
  
  const toggleSavePostMutation = useMutation({
    mutationFn: toggleSavePost,
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["savedPosts"] });
      
      // Snapshot the previous value
      const previousSavedPosts = queryClient.getQueryData(["savedPosts"]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["savedPosts"], (oldData = []) => {
        return oldData.filter(post => post.id !== postId);
      });
      
      return { previousSavedPosts };
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["savedPosts"], context.previousSavedPosts);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  return (
    <button 
      className="ml-auto p-1.5 rounded-full hover:bg-gray-200 transition-colors"
      onClick={() => toggleSavePostMutation.mutate(postId)}
      title="Unsave post"
    >
      <Bookmark className="h-4 w-4 text-indigo-600 fill-indigo-600" />
    </button>
  );
};

// Example of how to use this in the SavedPostsModal
const SavedPostItemActions = ({ post }) => {
  return (
    <div className="flex justify-end">
      <UnsavePostButton postId={post.id} />
    </div>
  );
};

export { UnsavePostButton, SavedPostItemActions };