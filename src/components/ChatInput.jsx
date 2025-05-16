import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage, typing } from "../api/apiCalls";
import { Send, Smile, Image } from "lucide-react";
import { handleInputChange } from "../utils/handlers";
import useUser from "../hooks/useUser";

const ChatInput = ({ activeConvId, conversations, setIsTyping, isTyping }) => {
    const queryClient = useQueryClient();
    // const [isTyping, setIsTyping] = useState(false)
    const [message, setMessage] = useState({
        content: "",
    })
    const { user } = useUser();
    const messageInputRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };
    const sendMessageMutation = useMutation({
        mutationFn: (message) => sendMessage(activeConvId, message),
        onMutate: async (newMessage) => {
            await queryClient.cancelQueries(['conversations']);
            const previousConversations = queryClient.getQueryData(['conversations']);
            const updatedConversations = conversations.map(convo => {
                if (convo.id === activeConvId) {
                    return {
                        ...convo,
                        messages: [
                            ...convo.messages,
                            {
                                id: convo.messages.length + 1,
                                sender_id: user.id,
                                content: newMessage.content,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                read_at: null,
                            }
                        ],
                        last_message_at: new Date().toISOString(),
                    };
                }
                return convo;
            });
            queryClient.setQueryData(['conversations'], {
                ...previousConversations,
                pages: previousConversations.pages.map(page => ({
                    ...page,
                    conversations: updatedConversations,
                })),
            });
            return { previousConversations };
        },
        onError: (err, newMessage, context) => {
            log("Error sending message: ", err);
            queryClient.setQueryData(['conversations'], context.previousConversations);
        },
        onSuccess: () => {
            scrollToBottom();
            messageInputRef.current?.focus();
        },
        onSettled: () => {
            queryClient.invalidateQueries(['conversations']);
        },
    });
    const handleSendMessage = () => {
        sendMessageMutation.mutate(message);
        setMessage({
            content: "",
        });
    };


    return (
        <div className="bg-white border-t border-gray-200 p-3 md:p-4">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                <div className="flex space-x-1 pl-2 md:pl-3">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors hidden sm:block">
                        <Image size={18} />
                    </button>
                </div>
                <input
                    ref={messageInputRef}
                    type="text"
                    name="content"
                    value={message.content}
                    onChange={e => handleInputChange(e, setMessage)}
                    placeholder="Type a message"
                    className="flex-1 bg-transparent border-none py-3 px-2 md:px-3 focus:outline-none text-gray-800"
                    onKeyUp={handleKeyPress}
                />
                <div className="flex pr-2 md:pr-3">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                        <Smile size={18} />
                    </button>
                    {/* {message.content?.trim() ? ( */}
                    <button
                        onClick={handleSendMessage}
                        disabled={message.content?.trim() === ''}
                        className={`p-1.5 rounded-md hover:bg-indigo-100 text-indigo-600 transition-colors ${message.content?.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Typing indicator (optional) */}
        </div>
    )
}

export default ChatInput