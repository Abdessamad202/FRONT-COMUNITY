import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  Home,
  User,
  Bell,
  MessageCircle,
  Search,
  Image,
  Link,
  MapPin,
  Calendar,
  Users,
  Bookmark,
  Video,
  ShoppingBag,
  Menu,
  LogOut
} from "lucide-react";
import ProfileSearch from "../components/ProfileSearch";
import FriendRequests from "../components/FriendRequest";
import SocialPost from "../components/Post";
import CreatePost from "../components/CreatePost";
import LeftSidebar from "../components/LeftSide";
import Posts from "../components/Posts";

const HomePage = () => {
  const { user } = useContext(UserContext);

  // Mock data for contacts
  const contacts = [
    { id: 1, name: "Sarah Johnson", avatar: "https://via.placeholder.com/40", online: true },
    { id: 2, name: "Michael Chen", avatar: "https://via.placeholder.com/40", online: true },
    { id: 3, name: "Jessica Williams", avatar: "https://via.placeholder.com/40", online: false },
    { id: 4, name: "David Rodriguez", avatar: "https://via.placeholder.com/40", online: true },
    { id: 5, name: "Emily Taylor", avatar: "https://via.placeholder.com/40", online: false },
    { id: 6, name: "Robert Johnson", avatar: "https://via.placeholder.com/40", online: false },
    { id: 7, name: "Lisa Brown", avatar: "https://via.placeholder.com/40", online: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="pt-16 pb-16 flex">
        {/* Left Sidebar - Fixed */}
        <LeftSidebar />

        {/* Content Area */}
        <div className="flex-1 px-4 lg:ml-64 mt-2.5 lg:mr-80 max-w-2xl mx-auto">
          {/* Create Post */}
          <CreatePost />

          {/* Posts Feed */}
          <div className="space-y-4">
            <Posts />
          </div>
        </div>

        {/* Right Sidebar - Fixed */}
        <div className="fixed right-0 top-16 w-82.5 h-screen overflow-y-auto hidden lg:block bg-gray-100 p-4">
          {/* Friend Requests - Small Panel */}
          <div className="mb-4">

          <ProfileSearch />
          </div>
          <FriendRequests />
        </div>
      </main>
    </div>
  );
};

export default HomePage;