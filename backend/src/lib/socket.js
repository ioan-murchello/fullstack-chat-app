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
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  console.log(userId, 'userId');
  
  if (userId) userSocketMap[userId] = socket.id;

  // * emit() is useed to send events to all the connected clients
  socketIo.emit("getOnlineUsers", Object.keys(userSocketMap));
  socketIo.on("disconnected", (socket) => {
    console.log("a user disconnected", socket.id);
    delete userSocketMap[userId];
    socketIo.emit("getOnlineUsers", Object.keys(userSocketMap[userId]));
  });
});

export { app, server, socketIo };
