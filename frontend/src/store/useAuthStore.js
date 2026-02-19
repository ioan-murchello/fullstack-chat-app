// @ts-nocheck
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const useAuthStore = create((set, get) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isChecking: true,
  isUpdatingProfile: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ user: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error, "error in auth check");
      set({ user: null });
    } finally {
      set({ isChecking: false });
    }
  },

  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      set({ user: res.data });
      toast.success("Signup successful!");
      get().connectSocket();
    } catch (error) {
      console.log(error, "error in signup");
      toast.error("Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (user) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", user); 
      set({ user: res.data });
      toast.success("Login successful!");
      get().connectSocket();
    } catch (error) {
      console.log(error, "error in login");
      toast.error("Login failed.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => { 
  try {

    await axiosInstance.post("/auth/logout");

    set({ user: null });
    
    get().disconnectSocket();
    
    toast.success("Logged out successfully");
  } catch (error) {
    console.log("Error in logout:", error);
    toast.error(error.response?.data?.message || "Logout failed");
  }
},

  updateUserProfile: async (avatar) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", avatar);
      set({ user: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL, {query: {
      userId: user._id
    }});
    set({ socket: socket });

    socket.on('getOnlineUsers',(userIds) => {
      set({onlineUsers: userIds})
    })

  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;
