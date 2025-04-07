import { Check, X } from "lucide-react";
import { Loader2 } from "lucide-react";

const FriendsenderButtons = ({ sender, acceptMutation, rejectMutation }) => {
    return (
        <div className="flex space-x-2">
            <button
                onClick={() => acceptMutation.mutate(sender)}
                disabled={acceptMutation.isLoading}
                className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
            >
                {acceptMutation.isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Check size={18} />
                )}
            </button>
            <button
                onClick={() => rejectMutation.mutate(sender)}
                disabled={rejectMutation.isLoading}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 disabled:opacity-50"
            >
                {rejectMutation.isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <X size={18} />
                )}
            </button>
        </div>
    );
};

export default FriendsenderButtons;
