import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import MessagesSkeleton from "./MessagesSkeleton";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../utils/utils";

const Chat = () => {
  const {
    messages, 
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeMessages
  } = useChatStore();
  const { user } = useAuthStore(); 
  const messageEndRef = useRef(null);

  useEffect(() => { 
      getMessages(selectedUser._id);
    
    subscribeToMessages();

    return () => {
      unsubscribeMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeMessages]);

  useEffect(() => {
    if(messageEndRef.current && messages.length > 0){
      messageEndRef.current.scrollIntoView()
    }
  },[messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessagesSkeleton />
        <ChatMessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            ref={messageEndRef}
            key={message._id}
            className={`chat ${
              message.sender === user._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div> 
      <ChatMessageInput />
    </div>
  );
};
export default Chat;
