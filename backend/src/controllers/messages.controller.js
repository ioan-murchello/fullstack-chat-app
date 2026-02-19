import cloudinary from "../lib/cloudinary.js";
import { getReciverSocket, socketIo } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Exclude the logged-in user without self user
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getMessages = async (req, res) => {
  const { id: userChatId } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, reciver: userChatId },
        { sender: userChatId, reciver: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const sender = req.user?._id;
    const reciver = req.params.id;

    if (!sender || !reciver) {
      return res.status(400).json({ message: "Missing sender or receiver" });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image);
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err.message);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      sender,
      reciver,
    });

    await newMessage.save();

    const reciverSocketId = getReciverSocket(reciver);
    if (reciverSocketId) {
      socketIo.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(401).json({
        message: "Unauthorized: You can only delete your own messages",
      });
    }

    message.text = "message was deleted";
    message.image = null; 
    message.isDeleted = true;
    await message.save();
 
    const receiverSocketId = getReciverSocket(message.reciver);
    if (receiverSocketId) {
      socketIo.to(receiverSocketId).emit("messageUpdate", message);
    }

    return res.status(200).json(message);
  } catch (error) {
    console.log("Error in deleteMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
