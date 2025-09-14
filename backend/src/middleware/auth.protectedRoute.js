import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, token - invalid" });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user - not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
}
