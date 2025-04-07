import { Link } from "react-router";

export default function ProfilePictureLink({ userId, picture, name }) {
    return (
        <Link
            to={`/profile/${userId}`} // Route: /profile/{id}
            className="flex-shrink-0 hover:ring-2 hover:ring-indigo-500 rounded-full transition-all"
            aria-label={`Visit ${name || "user"}'s profile`}
        >
            <img
                src={picture || "/default-avatar.png"}
                alt={`${name || "User"}'s avatar`}
                className="w-10 h-10 rounded-full object-cover border"
                onError={(e) => (e.target.src = "/default-avatar.png")}
            />
        </Link>
    );
}
