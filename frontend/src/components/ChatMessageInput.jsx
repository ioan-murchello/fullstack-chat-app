import { useState, useRef } from "react";
import useChatStore from "../store/useChatStore";
import { BiSend } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { LiaImageSolid } from "react-icons/lia";

const ChatMessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTypingStatus } = useChatStore();

  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Add these REFs at the top of your component
  const typingTimeoutRef = useRef(null);
  const isCurrentlyTyping = useRef(false);

  const handleInputText = (e) => {
    const value = e.target.value;
    setText(value);

    // 1. If we haven't told the server we're typing yet, do it now
    if (!isCurrentlyTyping.current && value.length > 0) {
      isCurrentlyTyping.current = true;
      sendTypingStatus(true);
    }

    // 2. ALWAYS clear the existing "Stop" timer every time a key is pressed
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // 3. Start a fresh 2.5-second timer
    // This timer ONLY fires if you STOP typing for 2.5 seconds
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      isCurrentlyTyping.current = false;
    }, 2500);

    // 4. If the user deletes everything, stop immediately
    if (value.length === 0) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTypingStatus(false);
      isCurrentlyTyping.current = false;
    }
  };

  const deleteImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text, image: imagePreview });
      setText("");
      sendTypingStatus(false);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={deleteImagePreview}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <AiOutlineClose className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => handleInputText(e)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePreviewImage}
          />

          <button
            type="button"
            className={` sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <LiaImageSolid size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <BiSend size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatMessageInput;
