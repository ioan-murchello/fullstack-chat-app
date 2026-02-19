import express from "express";
import authRoutes from "./routs/auth.route.js";
import messagesRoutes from "./routs/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config(); // * access environment variables

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" })); // or "20mb" depending on your needs // * parse incoming JSON requests( in controller, use req.body)
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.FRONTEND_URL, // frontend URL
    credentials: true, // allow cookies & auth headers
  }),
);
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/indext.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
