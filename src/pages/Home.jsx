// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { getUser, logOut } from "../api/apiCalls";
// import { useNavigate } from "react-router";
// import { NotificationContext } from "../context/NotificationContext";

// const Home = () => {
//   // notification
//   const notify = useContext(NotificationContext);
//   // context
//   const { user, setUser } = useContext(UserContext);

//   // router
//   const navigate = useNavigate();

//   // query
//   const { data: userData, isLoading: isGettingUser, error } = useQuery({
//     queryKey: ['user', user?.id], // ✅ Update query key to include user ID
//     queryFn: () => getUser(user.id),
//     enabled: !!user?.profileId,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
//   // mutations
//   const { mutate: logOutMutation, isPending: isLogout } = useMutation({
//     mutationFn: logOut,
//     onSuccess: () => {
//       notify("success", "Logged out successfully");
//       setUser({});
//       navigate("/login");
//     },
//     onError: (error) => {
//       console.log(error);
//     },
//   });

//   // handlers
//   const handleLogOut = (e) => {
//     e.preventDefault();
//     logOutMutation();
//   };

//   if (error) {
//     return (
//       <div className="p-6 flex flex-col items-center">
//         <p>Error fetching profile. Please try again.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 flex flex-col items-center">
//       {(isGettingUser || isLogout) && (
//         <div className="mt-6 flex justify-center">
//           <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
//         </div>
//       )}

//       {!isGettingUser && !isLogout && userData && (
//         <>
//           <h1 className="text-2xl font-bold text-indigo-600">Welcome to the App</h1>
//           <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold text-gray-700">Profile Data:</h2>
//             <p className="text-gray-600"><strong>Name:</strong> {userData.profile?.name}</p>
//             <p className="text-gray-600"><strong>Email:</strong> {userData?.email || "Not available"}</p>
//             <p className="text-gray-600"><strong>Sex:</strong> {userData.profile?.gender}</p>
//             <p className="text-gray-600"><strong>Date of Birth:</strong> {userData.profile?.date_of_birth}</p>
//             {/* {JSON.stringify(user)} */}
//           </div>
//         </>
//       )}

//       <button
//         onClick={handleLogOut}
//         className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium cursor-pointer"
//         disabled={isLogout || isGettingUser} // Disable while fetching or logging out
//       >
//         {isLogout ? "Logging out..." : "Logout"}
//       </button>
//     </div>
//   );
// };

// export default Home;
import { useContext, useState } from 'react';
import {
  Home,
  User,
  Bell,
  MessageCircle,
  Search,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Image,
  Link,
  MapPin,
  Calendar
} from 'lucide-react';
// import Posts from '../components/Posts';
import { UserContext } from '../context/UserContext';
// import AddPost from '../components/AddPost';

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-20 pb-16 max-w-6xl mx-auto px-4">
        {/* Navigation Bar */}
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="md:col-span-2 space-y-6">
            {/* Create Post */}
            {/* <AddPost /> */}
            {/* Posts */}
            {[1, 2, 3].map((post) => (
          <div key={post} className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-semibold">User Name</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="mt-4">This is a sample post content. It can contain text, images, or other media.</p>
              <img src="https://placehold.co/600x400" alt="Post content" className="mt-4 rounded-lg w-full" />
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-400">
                <button className="flex items-center text-gray-600">
                  <Heart className="w-5 h-5 mr-1" /> 24
                </button>
                <button className="flex items-center text-gray-600">
                  <MessageSquare className="w-5 h-5 mr-1" /> 12
                </button>
                <button className="flex items-center text-gray-600">
                  <Share2 className="w-5 h-5 mr-1" /> Share
                </button>
                <button className="flex items-center text-gray-600">
                  <Bookmark className="w-5 h-5 mr-1" /> Save
                </button>
              </div>
            </div>
          </div>
        ))}
            {/* <Posts /> */}
          </div>

          {/* Sidebar */}
          <div className="hidden md:block space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 bg-transparent focus:outline-none flex-1"
                />
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Trending Topics</h2>
              {['#Technology', '#Travel', '#Food'].map((topic) => (
                <div key={topic} className="py-2">
                  <p className="font-medium text-blue-600">{topic}</p>
                  <p className="text-sm text-gray-500">1.2K posts</p>
                </div>
              ))}
            </div>

            {/* Suggested Friends */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">Suggested Friends</h2>
              {[1, 2, 3].map((friend) => (
                <div key={friend} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <p className="font-medium">Friend Name</p>
                  </div>
                  <button className="text-blue-600 font-medium">Follow</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default HomePage;