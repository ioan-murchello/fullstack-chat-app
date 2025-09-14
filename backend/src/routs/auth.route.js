import express from "express";
import { login, signup, logout, updateProfile } from "../controllers/auth.controller.js";
import { checkAuth, protectedRoute } from "../middleware/auth.protectedRoute.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfile); // ? 'protectRoute' to see if user is authenticated
router.get("/check", protectedRoute, checkAuth);  

export default router;
 
