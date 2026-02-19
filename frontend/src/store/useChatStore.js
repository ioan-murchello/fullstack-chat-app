import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isTyping: false,

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  deleteMessage: async (msgId) => {
    try {
      const res = await axiosInstance.delete(`/messages/delete/${msgId}`);
      const updatedMessage = res.data;

      set({
        messages: get().messages.map((msg) =>
          msg._id === msgId ? updatedMessage : msg,
        ),
      });

      toast.success("Message removed");
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser._id) return;

    const socket = useAuthStore.getState().socket;
    (socket.on("newMessage", (newMessage) => {
      if (newMessage.sender !== selectedUser._id) return;
      const msg = get().messages;
      set({
        messages: [...msg, newMessage],
      });
    }),
      socket.on("messageUpdate", (updatedMessage) => {
        set({
          messages: get().messages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg,
          ),
        });
      }),
      socket.on("userTyping", ({ senderId }) => {
        if (senderId === get().selectedUser?._id) {
          set({ isTyping: true });
        }
      }),
      socket.on("userStoppedTyping", ({ senderId }) => {
        if (senderId === get().selectedUser?._id) {
          set({ isTyping: false });
        }
      }));
  },

  unsubscribeMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  },

  sendTypingStatus: (isTyping) => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser || !socket) return;

    if (isTyping) {
      socket.emit("typing", { receiverId: selectedUser._id });
    } else {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
  },
}));

export default useChatStore;
