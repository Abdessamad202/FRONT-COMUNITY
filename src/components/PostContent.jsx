import { LazyLoadImage } from "react-lazy-load-image-component";

const fallbackImage = "https://placehold.co/600x400?text=No+Image";

export default function PostContent({ post }) {
    return (
        <>
            {/* Post text content */}
            <div className="mb-3">
                <div className="text-black-700 leading-relaxed">{post.content}</div>
            </div>

            {/* Post image (if exists) */}
            {post.image && (
                <div className="rounded-xl overflow-hidden shadow-sm mb-4">
                    <LazyLoadImage
                        src={post.image}
                        alt="Post content"
                        effect="blur"
                        className="w-full h-64 object-cover"
                        wrapperClassName="w-full"
                        placeholder={<div className="w-full h-64 bg-indigo-200 animate-pulse" />}
                        onError={(e) => { e.target.src = fallbackImage }}
                    />
                </div>
            )}
        </>
    );
}
