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
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },
  subscribeToMessages: () => {
    const {selectedUser} = get() 
    if(!selectedUser._id) return

    const socket = useAuthStore.getState().socket
    socket.on('newMessage', (newMessage) => {  
      console.log(newMessage, 'message');
      
      if(newMessage.sender !== selectedUser._id) return
      const msg = get().messages 
      set({
        messages: [...msg, newMessage]
      })
    })
  },
  
  unsubscribeMessages: () => {
    const socket = useAuthStore.getState().socket 
    socket.off('newMessages')
  }


}));

export default useChatStore;
