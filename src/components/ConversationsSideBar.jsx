import { useInfiniteQuery } from "@tanstack/react-query";
import { Bell, FileText, Plus, Search, Settings, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getConversations } from "../api/apiCalls";
import useUser from "../hooks/useUser";
import { format, isToday, isYesterday } from "date-fns";
import ProfilePictureLink from "./ProfilePictureLink";

export default function ConversationsSideBar({ activeConversation, setActiveConversation, showSidebar, setShowSidebar }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isCompactSidebar, setIsCompactSidebar] = useState(false);
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['conversations'],
        queryFn: ({ pageParam = 1 }) => getConversations(pageParam),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? false,
    });
    const { user } = useUser()
    const conversations = (data?.pages.flatMap((page) => page.conversations) || [])
        .sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));

    const getSidebarWidth = () => {
        if (isCompactSidebar) return 'w-20';
        return 'w-80 md:w-72 lg:w-80';
    };
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 320); // True for really small screens
            setIsSmallScreen(window.innerWidth < 768); // True for small screens
            setIsCompactSidebar(window.innerWidth >= 320 && window.innerWidth < 1024); // Compact sidebar for sm-md screens

            if (window.innerWidth < 320) {
                setShowSidebar(false);
                setShowRightPanel(false);
            } else {
                setShowSidebar(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleConversationClick = (id) => {
        setActiveConversation(id);
        if (isMobile) {
            setShowSidebar(false);
        }
    };
    const formatMessageTime = (time) => {
        const date = new Date(time);

        if (isToday(date)) {
            return format(date, 'hh:mm a');  // e.g. 03:20 PM
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'd/M/yyyy'); // e.g. 14/4/2025
        }
    };


    return (
        <>
            {(isMobile && showSidebar) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}
            <div
                className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'
                    } relative bg-white border-r border-gray-200 transition-all duration-300 
                flex flex-col shadow-sm overflow-hidden ${getSidebarWidth()} z-20 h-full`}
            >
                <div className={`py-4 ${isCompactSidebar ? 'px-2' : 'px-5'} border-b border-gray-200 bg-indigo-700 text-white`}>
                    <div className="flex items-center justify-between">
                        {!isCompactSidebar && <h1 className="text-lg font-semibold">Messages</h1>}
                        {isCompactSidebar && (
                            <div className="flex w-full justify-center">
                                <Bell size={20} />
                            </div>
                        )}
                        <div className="flex space-x-2">
                            {!isCompactSidebar && (
                                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors">
                                    <Settings size={18} />
                                </button>
                            )}
                            {isMobile && (
                                <button
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors"
                                    onClick={() => setShowSidebar(false)}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    {!isCompactSidebar && (
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search conversations"
                                className="w-full bg-indigo-600 text-white placeholder-indigo-300 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <Search size={16} className="absolute left-3 top-3 text-indigo-300" />
                        </div>
                    )}
                </div>

                <div className={`py-3 ${isCompactSidebar ? 'px-2' : 'px-4'} border-b border-gray-200 bg-white`}>
                    <div className="flex justify-between items-center">
                        {!isCompactSidebar && <h2 className="font-medium text-gray-700">Recent</h2>}
                        {isCompactSidebar && (
                            <div className="w-full flex justify-center">
                                <button onClick={() => setIsCompactSidebar(false)} className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                        {!isCompactSidebar && (
                            <button onClick={() => setIsCompactSidebar(true)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">Hide SideBar</button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        // Skeleton placeholders while loading
                        Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-full flex items-center px-4 py-3 border-b border-gray-100 animate-pulse"
                            >
                                <div className="relative">
                                    <div className={`${isCompactSidebar ? 'w-8 h-8' : 'w-12 h-12'} bg-gray-200 rounded-full`}></div>
                                </div>
                                {!isCompactSidebar && (
                                    <div className="ml-3 flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/5"></div>
                                        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                className={`w-full flex transition-all ${isCompactSidebar ? 'justify-center px-2 py-2' : 'items-center px-2 py-3'}   text-left border-b border-gray-100 hover:bg-gray-50 transition-colors 
                                ${activeConversation === conversation.id ? (isCompactSidebar ? 'bg-indigo-50 border-l-2 border-l-indigo-600' : 'bg-indigo-50 border-l-4 border-l-indigo-600') : ''}`}
                                onClick={() => handleConversationClick(conversation.id)}
                            >
                                <div className="relative">
                                    {!isCompactSidebar ? (
                                        <ProfilePictureLink name={conversation.participant[0].profile.name} picture={conversation.participant[0]?.profile?.picture} isCompactSidebar={isCompactSidebar && isMobile} userId={conversation.participant[0].id} />

                                    ) : (

                                        <img
                                            src={conversation.participant[0]?.profile?.picture}
                                            alt={conversation.participant[0].name}
                                            className={`w-11 h-11 rounded-full object-cover`}
                                        />
                                    )}
                                    {conversation.isOnline && (
                                        <div className={`absolute bottom-0 right-0 ${isCompactSidebar ? 'w-2 h-2' : 'w-3 h-3'} bg-green-500 rounded-full border-2 border-white`}></div>
                                    )}
                                    {conversation.unreaded_count > 0 && (
                                        <div className={`absolute ${isCompactSidebar ? '-top-1 -right-1' : 'top-0 -right-1'} bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center`}>
                                            {conversation.unreaded_count}
                                        </div>
                                    )}
                                </div>
                                {!isCompactSidebar && (
                                    <div className="ml-3 flex-1 truncate">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-medium truncate ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                                                {conversation.participant[0].profile.name}
                                            </h3>
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                {conversation.messages.length > 0
                                                    ? formatMessageTime(conversation.messages[conversation.messages.length - 1].created_at)
                                                    : "No messages"}
                                            </span>

                                        </div>
                                        {/* {conversation.position && (
                                            <p className="text-xs text-indigo-600 mb-0.5">{conversation.position}</p>
                                        )} */}
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate ${conversation.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`} title={conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : conversation.last_message_at}>
                                                {conversation.messages.length > 0
                                                    ? `${conversation.messages[conversation.messages.length - 1].sender_id == user?.id ? 'You: ' : ''}${conversation.messages[conversation.messages.length - 1].content}`
                                                    : conversation.last_message_at}
                                            </p>
                                            {/* {conversation.unread > 0 && (
                                                <span className="bg-indigo-600 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5 ml-2">
                                                    {conversation.unread}
                                                </span>
                                            )} */}
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {isCompactSidebar && (
                    <div className="py-3 border-t border-gray-200 bg-gray-50 flex justify-center">
                        <button className="p-2 rounded-lg hover:bg-gray-200 text-gray-700">
                            <Settings size={16} />
                        </button>
                    </div>
                )}
            </div>
            {/* Mobile overlay when details panel is open */}
            {isMobile && showRightPanel && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setShowRightPanel(false)}
                ></div>
            )}
        </>
    )
}