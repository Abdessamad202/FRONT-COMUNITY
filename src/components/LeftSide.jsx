import { useState } from "react";
import { Link } from "react-router";
import { Users, Bookmark } from "lucide-react";
import useUser from "../hooks/useUser";
import FriendsModal from "./FriendsModal";
import SavedPostsModal from "./SavedPostsModal"; // Import the new modal

const LeftSidebar = () => {
  const { data: user, isLoading } = useUser();
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isSavedPostsModalOpen, setIsSavedPostsModalOpen] = useState(false); // New state for saved posts modal

  // Updated sidebar items to handle both modals
  const sidebarItems = [
    {
      onClick: () => setIsFriendsModalOpen(true),
      label: "Friends",
      icon: Users,
      description: "Connect with your network",
    },
    {
      onClick: () => setIsSavedPostsModalOpen(true), // Open saved posts modal
      label: "Saved",
      icon: Bookmark,
      description: "View your bookmarked content",
    },
  ];

  return (
    <>
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-sm border-r border-gray-100 overflow-y-auto hidden lg:block">
        {/* User Profile Summary */}
        {isLoading ? (
          <div className="flex items-center space-x-3 p-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
        ) : (
          <div className="p-4 border-b border-gray-100">
            <Link to={`/profile/${user?.id}`} className="flex items-center space-x-3 group">
              <img
                src={user?.profile?.picture || "/default-avatar.png"}
                alt={`${user?.profile?.name || "User"}'s profile`}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
              <div>
                <span className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {user?.profile?.name || "User"}
                </span>
                <p className="text-xs text-gray-500">View your profile</p>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-2">
          <div className="mt-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Navigation
            </h3>
            <div className="mt-3 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex cursor-pointer items-center px-4 py-3 rounded-lg hover:bg-gray-50 group transition-all duration-200 w-full text-left"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {item.label}
                    </span>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer with app version */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-400">
          App v1.0.2
        </div>
      </aside>

      {/* Modals */}
      {isFriendsModalOpen && (
        <FriendsModal user={user} toggleModal={() => setIsFriendsModalOpen(false)} />
      )}
      
      {isSavedPostsModalOpen && (
        <SavedPostsModal toggleModal={() => setIsSavedPostsModalOpen(false)} />
      )}
    </>
  );
};

export default LeftSidebar;