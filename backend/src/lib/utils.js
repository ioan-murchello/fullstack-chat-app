import jwt from "jsonwebtoken";
import rateLimit from 'express-rate-limit';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // * only milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // * only send cookie over HTTPS in production,
    sameSite: "strict",
    path: '/'
  });
  return token;
};

export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per window
  message: {
    error: "Too many messages sent. Please try again after a minute."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});
