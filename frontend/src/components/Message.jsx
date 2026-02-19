import { useEffect, useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";

const Message = ({ message, deleteMessage, user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef(null);
  const popupRef = useRef(null);

  const startPress = () => {
    if (showPopup) return;
    timerRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!showPopup) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    const timeoutId = setTimeout(() => {
      window.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  return (
    <div className="relative group select-none">
      <div
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        className={`chat-bubble break-words whitespace-pre-wrap flex flex-col w-fit min-w-[50px] max-w-[65vw] sm:max-w-[300px] md:max-w-[500px] cursor-pointer ${
          message.isDeleted ? "bg-green-200 text-black italic opacity-70" : ""
        }`}
      >
        {message.text && <p>{message.text}</p>}
      </div>

      {showPopup && !message.isDeleted && message.sender === user._id && (
        <div
          ref={popupRef}
          className="absolute -top-2 -translate-x-4/5  sm:-translate-x-4/5  z-[100] animate-in fade-in zoom-in duration-200"
        >
          <div className="bg-base-100 shadow-2xl border border-base-300 rounded-lg p-1 flex items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteMessage(message._id);
                setShowPopup(false);
              }}
              className="btn btn-ghost btn-sm text-error flex items-center gap-2 hover:bg-error/10"
            >
              <BiTrash className="size-4" />
              Delete
            </button>
          </div>
          <div className="w-2 h-2 bg-base-100 border-r border-b border-base-300 rotate-45 ml-auto mr-4 -mt-1"></div>
        </div>
      )}
    </div>
  );
};

export default Message;
