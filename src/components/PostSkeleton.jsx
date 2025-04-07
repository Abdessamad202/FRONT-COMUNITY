// components/PostSkeleton.jsx

const PostSkeleton = () => {
    return (
        <div className="animate-pulse bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                    <div className="w-40 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-3 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="h-52 bg-gray-100 rounded-lg" />
            <div className="flex justify-between pt-2">
                <div className="w-20 h-8 bg-gray-200 rounded" />
                <div className="w-20 h-8 bg-gray-200 rounded" />
                <div className="w-20 h-8 bg-gray-200 rounded" />
            </div>
        </div>
    );
};

export default PostSkeleton;
