import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import MessagesSkeleton from "./MessagesSkeleton";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../utils/utils";
import TypingIndicators from "./TyppingIndicators";
import Message from "./Message";

const Chat = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeMessages,
    isTyping,
    deleteMessage,
  } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
    subscribeToMessages(selectedUser._id);
    return () => unsubscribeMessages(selectedUser._id);
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isTyping]);

  if (!messages.length && !isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-auto">
        <ChatHeader />
        <p className="flex-1 text-center text-base-content/70 mt-4">No messages yet</p>
        <ChatMessageInput />
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      // flex-1 flex flex-col overflow-auto
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessagesSkeleton />
        <ChatMessageInput />
      </div>
    );
  }
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full w-full overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 sm:space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.sender === user._id ? "chat-end" : "chat-start"
            } w-full`}
          >
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <Message
              message={message}
              deleteMessage={deleteMessage}
              user={user}
            />
          </div>
        ))}
        {isTyping && <TypingIndicators />}
        <div ref={messageEndRef} />
      </div>
      <ChatMessageInput />
    </div>
  );
};
export default Chat;
