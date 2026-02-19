const TypingIndicators = () => {
  return (
    <div className="chat chat-start animate-fade-in">
      {/* This creates the little 'tail' or 'peak' automatically */}
      <div className="chat-bubble bg-base-200 flex gap-1 items-center px-4 py-3">
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicators;
