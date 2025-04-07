import { Link, useLocation } from "react-router"; // Fixed import syntax
import { Bell, Home, MessageCircle, User, LogOut, Settings, X } from "lucide-react"; // Added X for close icon
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, logOut } from "../api/apiCalls";
import { cn } from "../utils/cn";
import { useEffect, useState, useRef, useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { UserContext } from "../context/UserContext";
import useUser from "../hooks/useUser";

const NavBar = () => {
  const { pathname } = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setUser } = useContext(UserContext);
  const profileRef = useRef(null);
  const notify = useContext(NotificationContext);
  const queryClient = useQueryClient()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isProfileOpen]);

  const { data:user, isLoading, error } = useUser();

  const logoutMutation = useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      notify(data.status, data.message);
      setUser({});
      setIsMobileMenuOpen(false); // Close mobile menu on logout
    },
    onError: (error) => {
      notify("error", error.message || "Logout failed!");
    },
    onSettled: () => {
      queryClient.removeQueries(["user"])
    }
  });

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
  ];

  const profileMenuItems = [
    { path: "/profile/"+user?.id, label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/logout", label: "Log Out", icon: LogOut },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-2xl font-semibold text-indigo-700 tracking-tight">
            SocialApp
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center p-2 rounded-md transition-colors duration-200",
                  pathname === item.path
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">{item.label}</span>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-200 focus:ring-2 focus:ring-indigo-500"
                aria-label="Profile menu"
                aria-expanded={isProfileOpen}
              >
                {isLoading ? (
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <img
                    src={user?.profile?.picture || "/default-avatar.png"}
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                  />
                )}
              </button>

              {isProfileOpen && !isLoading && !error && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
                    <img
                      src={user?.profile?.picture || "/default-avatar.png"}
                      alt="Profile Picture"
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.profile?.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.profile?.email || "example@email.com"}
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    {profileMenuItems.map((item) =>
                      item.path === "/logout" ? (
                        <button
                          key={item.path}
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="px-4 py-4">
          {/* User Info Header */}
          {!isLoading && !error && (
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
              <img
                src={user?.profile?.picture || "/default-avatar.png"}
                alt="Profile Picture"
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {user?.profile?.name || "User"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.profile?.email || "example@email.com"}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150",
                pathname === item.path && "text-indigo-600 bg-indigo-50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}

          {/* Profile Menu Items */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {profileMenuItems.map((item) =>
              item.path === "/logout" ? (
                <button
                  key={item.path}
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className={cn(
                    "w-full text-left flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150",
                    logoutMutation.isPending && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors duration-150",
                    pathname === item.path && "text-indigo-600 bg-indigo-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;