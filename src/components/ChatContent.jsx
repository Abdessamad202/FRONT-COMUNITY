import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Image, Info, Mic, MoreHorizontal, Paperclip, Phone, Send, Smile, Video } from "lucide-react"
import { getConversations, sendMessage, typing } from "../api/apiCalls";
import useUser from "../hooks/useUser";
import { use, useEffect, useRef, useState } from "react";
import ProfilePictureLink from "./ProfilePictureLink";
import ChatInput from "./ChatInput";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import Pusher from "pusher-js";
import { u } from "framer-motion/client";
import { handleInputChange } from "../utils/handlers";
import { getToken } from "../utils/localStorage";
import MessageStatus from "./MessageStatus";
import ably from "../utils/pusher";

export default function ChatContent({ activeConvId, showSidebar, setShowSidebar, showRightPanel, setShowRightPanel }) {
    const queryClient = useQueryClient()
    const [isTyping, setIsTyping] = useState(false);

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
    const conversations = data?.pages.flatMap((page) => page.conversations) || [];
    const [activeConvo, setActiveConvo] = useState();
    useEffect(() => {
        if (activeConvId) {
            setActiveConvo(conversations.find((conv) => conv.id === activeConvId))
        }
    }, [activeConvId, conversations])
    const participant = activeConvo?.participant?.[0]
    const messagesEndRef = useRef(null);
    const { user } = useUser()

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConvId, activeConvo?.messages.length, isTyping]);

    // Format the message time based on date
    const formatMessageTime = (dateString) => {
        if (!dateString) return '';

        const date = parseISO(dateString);

        return format(date, 'h:mm a');
        // if (isToday(date)) {
        // } else if (isYesterday(date)) {
        // return 'Yesterday ' + format(date, 'h:mm a');
        // } else {
        // return format(date, 'MMM d, h:mm a');
        // }
    };

    // Function to format date separator
    const formatDateSeparator = (dateString) => {
        if (!dateString) return '';

        const date = parseISO(dateString);

        if (isToday(date)) {
            return 'Today';
        } else if (isYesterday(date)) {
            return 'Yesterday';
        } else {
            return format(date, 'MMMM d, yyyy');
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        if (!messages || messages.length === 0) return [];

        const groups = [];
        let currentDate = null;
        let currentMessages = [];

        messages.forEach(message => {
            const messageDate = parseISO(message?.created_at);
            const dateKey = format(messageDate, 'yyyy-MM-dd');

            if (currentDate !== dateKey) {
                if (currentMessages.length > 0) {
                    groups.push({
                        date: currentDate,
                        separator: formatDateSeparator(currentMessages[0].created_at),
                        messages: currentMessages
                    });
                }
                currentDate = dateKey;
                currentMessages = [message];
            } else {
                currentMessages.push(message);
            }
        });

        if (currentMessages.length > 0) {
            groups.push({
                date: currentDate,
                separator: formatDateSeparator(currentMessages[0].created_at),
                messages: currentMessages
            });
        }

        return groups;
    };

    const [message, setMessage] = useState({
        content: "",
    })
    const messageInputRef = useRef(null);

    useEffect(() => {
        if (!activeConvId) return;
        // Subscribe to the channel
        const chatChannelName = `chat.${activeConvId}`;
        console.log("Subscribing to channel:", chatChannelName);

        // Subscribe to the channel and listen for 'message-sent'
        const channel = ably.channels.get(`conversation.${activeConvId}`);
        channel.subscribe('message-sent', (data) => {
            console.log("Received via Pusher: ", data);
            // Handle received data and update state
            queryClient.setQueryData(['conversations'], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        conversations: page.conversations.map(conv => {
                            if (conv.id === activeConvId) {
                                let newMessage = data.message;

                                // Add new message to conversation
                                return {
                                    ...conv,
                                    messages: [...conv.messages, newMessage]
                                };
                            }
                            return conv;
                        })
                    }))
                };
            });

            // Scroll to bottom (if necessary)
            scrollToBottom();
            messageInputRef.current?.focus();
        });

        // Cleanup subscription on component unmount
        return () => {
            channel.unsubscribe(chatChannelName);
        };

    }, [activeConvId]);



    // If no conversation is selected, show empty state
    if (!activeConvId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center p-8 max-w-md">
                    <div className="bg-indigo-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Messages</h2>
                    <p className="text-gray-600 mb-6">Select a conversation from the sidebar to start chatting or create a new one.</p>
                    {!showSidebar && (
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <ChevronLeft size={16} className="mr-2" />
                            Show conversations
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Group messages by date
    const messageGroups = groupMessagesByDate(activeConvo?.messages || []);
    if (activeConvo) {
        return (
            <>
                <div className="flex-1 flex flex-col w-full md:w-auto">
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center">
                            {!showSidebar && (
                                <button
                                    onClick={() => setShowSidebar(true)}
                                    className="mr-4 text-gray-600 hover:text-gray-900"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                            <div className="flex items-center">
                                <div className="relative">
                                    {participant && (
                                        <ProfilePictureLink
                                            name={participant.profile.name}
                                            picture={participant.profile.picture}
                                            userId={participant.id}
                                        />
                                    )}
                                    {activeConvo?.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h2 className="font-medium text-gray-900">{participant?.profile.name}</h2>
                                        {activeConvo?.isGroup && (
                                            <span className="ml-2 text-xs py-0.5 px-2 bg-indigo-100 text-indigo-800 rounded-full">Group</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center truncate max-w-32 md:max-w-full">
                                        {activeConvo?.isOnline ? (
                                            <>
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                                Active now
                                            </>
                                        ) : activeConvo?.lastSeen}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700" onClick={() => setShowRightPanel(!showRightPanel)}>
                                <Info size={18} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 md:hidden">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50" id="messages-container">
                        <div className="flex flex-col space-y-6">
                            {messageGroups.map((group, groupIndex) => (
                                <div key={group.date} className="space-y-4">
                                    {/* Date separator */}
                                    <div className="flex justify-center mb-4">
                                        <div className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                            {group.separator}
                                        </div>
                                    </div>

                                    {/* Messages for this date */}
                                    {group.messages.map((message, index) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${message.sender_id === user.id ? 'ml-2' : ''}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl shadow-sm ${message.sender_id === user.id
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-800 border border-gray-100'
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                </div>
                                                <div className={`text-xs mt-1 ${message.sender_id === user.id ? 'text-right' : ''} text-gray-500`}>
                                                    {formatMessageTime(message.created_at)} {message.sender_id === user.id && <MessageStatus status={message.read_at !== null ? 'read' : 'sent'} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2  text-gray-800 rounded-bl-none">
                                                <div className="flex space-x-1 items-center h-6">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input code commented out in original */}
                    {/* Chat Input */}
                    <ChatInput activeConvId={activeConvId} isTyping={isTyping} setIsTyping={setIsTyping} conversations={conversations} />
                </div>
            </>
        )
    }
}