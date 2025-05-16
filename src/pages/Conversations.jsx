import { useEffect, useRef, useState } from "react";
import ConversationsSideBar from "../components/ConversationsSideBar";
import ChatContent from "../components/ChatContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../hooks/useUser";
// import { readMessages } from "../api/apiCalls";

export default function Conversations() {
    const [activeConversation, setActiveConversation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showRightPanel, setShowRightPanel] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isCompactSidebar, setIsCompactSidebar] = useState(false);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    const queryClient = useQueryClient();
    const { user } = useUser()

    // const readMessagesMutation = useMutation({
    //     mutationFn: (conversationId) => readMessages(conversationId),
    //     onMutate: async (conversationId) => {
    //         await queryClient.cancelQueries(['conversations']);
    //         const previousConversations = queryClient.getQueryData(['conversations']);

    //         queryClient.setQueryData(['conversations'], (oldData) => {
    //             if (!oldData) return oldData;

    //             return {
    //                 ...oldData,
    //                 pages: oldData.pages.map(page => ({
    //                     ...page,
    //                     conversations: page.conversations.map(conv => {
    //                         if (conv.id === conversationId) {
    //                             return {
    //                                 ...conv,
    //                                 messages: conv.messages.map(msg => {
    //                                     if (msg.sender_id !== user.id) {
    //                                         return { ...msg, read_at: new Date().toISOString() };
    //                                     }
    //                                     return msg;
    //                                 }),
    //                                 unreaded_count: 0
    //                             };
    //                         }
    //                         return conv;
    //                     })
    //                 }))
    //             };
    //         });

    //         return { previousConversations };
    //     },
    //     onError: (err, newMessage, context) => {
    //         queryClient.setQueryData(['conversations'], context.previousConversations);
    //     },
    //     onSettled: () => {
    //         queryClient.invalidateQueries(['conversations']);
    //     }
    // });
    // useEffect(() => {
    //     if (!activeConversation) return;
    //     const chatChannelName = `chat.${activeConversation}`;
    //     const chatChannel = pusher.subscribe(chatChannelName);

    //     chatChannel.bind('message-sent', (data) => {
    //         console.log("Received via Pusher: ", data);
    //         if (data.message.sender_id == user.id) return
    //         queryClient.setQueryData(['conversations'], (oldData) => {
    //             if (!oldData) return oldData;

    //             return {
    //                 ...oldData,
    //                 pages: oldData.pages.map(page => ({
    //                     ...page,
    //                     conversations: page.conversations.map(conv => {
    //                         if (conv.id === activeConversation) {
    //                             return {
    //                                 ...conv,
    //                                 unreaded_count: conv.unreaded_count + 1
    //                             };
    //                         }
    //                         return conv;
    //                     })
    //                 }))
    //             };
    //         });
    //     });

    //     // Cleanup
    //     return () => {
    //         pusher.unsubscribe(chatChannelName);
    //     };

    // }, [activeConversation]);
    // useEffect(() => {
    //     // read messages when the chat content is mounted
    //     if (activeConversation) {
    //         readMessagesMutation.mutate(activeConversation);
    //     }

    // }, [activeConversation]);
    return (
        <div className="flex h-[calc(100vh-64px)] mt-[64px] bg-gray-50">
            <ConversationsSideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} activeConversation={activeConversation} setActiveConversation={setActiveConversation} />
            <ChatContent showSidebar={showSidebar} setShowSidebar={setShowSidebar} activeConvId={activeConversation} />
        </div>
    );
}