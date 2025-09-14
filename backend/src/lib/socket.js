import { Server } from "socket.io";
import http from "http";
import express from "express"; 

const app = express();
const server = http.createServer(app);

const socketIo = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
// * used to store online users
const userSocketMap = {}; // ? {user._id: socket.id}

export function getReciverSocket(userId){
  return userSocketMap[userId]
}

socketIo.on("connection", (socket) => { 
  const userId = socket.handshake.query.userId; 
  
  if (userId) userSocketMap[userId] = socket.id;

  // * emit() is useed to send events to all the connected clients
  socketIo.emit("getOnlineUsers", Object.keys(userSocketMap));
  socketIo.on("disconnected", (socket) => { 
    delete userSocketMap[userId];
    socketIo.emit("getOnlineUsers", Object.keys(userSocketMap[userId]));
  });
});

export { app, server, socketIo };
