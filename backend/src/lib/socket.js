import { Server } from "socket.io";
import http from "http";
import express from "express"; 

const app = express();
const server = http.createServer(app);

const socketIo = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "development" 
      ? "http://localhost:5173" 
      : process.env.FRONTEND_URL,
    credentials: true
  },
});
// * used to store online users
const userSocketMap = {}; // ? {user._id: socket.id}

export function getReciverSocket(userId){
  return userSocketMap[userId]
}

socketIo.on("connection", (socket) => { 
  const userId = socket.handshake.query.userId; 
  
  // 1. Assign the userId to the socket object so you can use it later
  if (userId) {
    socket.userId = userId; 
    userSocketMap[userId] = socket.id;
  }

  // 2. Relay typing events (Now socket.userId will actually have a value)
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReciverSocket(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("userTyping", { senderId: socket.userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReciverSocket(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("userStoppedTyping", { senderId: socket.userId });
    }
  });

  // Send the list of online users to everyone
  socketIo.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 3. FIX: Use 'socket.on' (individual), not 'socketIo.on' (global)
  socket.on("disconnect", () => { 
    console.log("User disconnected:", socket.userId);
    if (socket.userId) {
      delete userSocketMap[socket.userId];
    }
    socketIo.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, socketIo };
