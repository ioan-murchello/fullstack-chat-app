import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to your .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dotenv.config();

const usersToCreate = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
  { name: "Alice Johnson", email: "alice@example.com" },
  { name: "Bob Wilson", email: "bob@example.com" },
  { name: "Charlie Brown", email: "charlie@example.com" },
  { name: "Diana Prince", email: "diana@example.com" },
  { name: "Ethan Hunt", email: "ethan@example.com" },
  { name: "Fiona Gallagher", email: "fiona@example.com" },
  { name: "George Miller", email: "george@example.com" },
  { name: "Hannah Abbott", email: "hannah@example.com" },
];

const seedUsers = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing from .env");

    await mongoose.connect(uri);
    // await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Optional: Delete previous dummy users to avoid duplicates
    await User.deleteMany({ email: { $regex: /@example.com/ } });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const userObjects = usersToCreate.map((u, index) => ({
      username: u.name,
      email: u.email,
      password: hashedPassword,
      // Using DiceBear for cool 3D avatars
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
    }));

    await User.insertMany(userObjects);
    console.log(`✅ Created ${userObjects.length} users successfully!`);

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
};

seedUsers();
