import { useEffect, useState } from "react";
import useChatStore from "../store/useChatStore";
import { IoPeople } from "react-icons/io5";
import useAuthStore from "../store/useAuthStore";

const Sidebar = () => {
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const { users, getUsers, setSelectedUser, isUserLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) {
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
      </div>
    );
  }
  return (
    <aside className={`w-full h-full border-r border-base-300 bg-base-200 p-4 flex absolute top-0 left-0
    ${selectedUser ? "-translate-x-[120%]" : "translate-x-0"}
    sm:w-64 z-10 sm:translate-x-0 sm:static flex-col`}>
      <div className="flex flex-col items-start gap-2 py-5 mb-4 border-b border-base-600">
        <div className="flex items-center gap-2 mb-4">
          <IoPeople className="size-6 text-primary" />
          <span className="font-medium block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto h-full">
        {filteredUsers?.map((user) => {
          const userOnline = onlineUsers?.includes(user._id);
          return (
            <button
              key={user._id}
              className={`flex justify-start items-center gap-2 p-2 rounded-md ${
                selectedUser?._id === user._id
                  ? "bg-base-100 text-primary-content ring-1 ring-base-100"
                  : "hover:bg-base-300"
              } cursor-pointer`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.avatar || "/avatar.png"}
                className={`size-8 text-primary rounded-full overflow-hidden object-cover 
                ${userOnline ? "border-2 border-green-400" : ""}`}
              />
              <div className="flex flex-col items-start gap-2 flex-1">
                <span className="font-medium">
                  {user.username || "Unknown User"}
                </span>
                <div className="text-sm text-zinc-400">
                  {userOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
