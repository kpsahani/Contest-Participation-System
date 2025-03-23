import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt for password hashing
import User from "../models/User.js";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

// User seed data
const users = [
  {
    username: "admin",
    email: "admin@test.com",
    password: "admin123", // Will be hashed before saving
    role: "admin",
  },
  {
    username: "vipuser",
    email: "vip@test.com",
    password: "vip123",
    role: "vip",
  },
  {
    username: "normaluser",
    email: "normal@test.com",
    password: "normal123",
    role: "user",
  },
];


const getPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
// Function to seed users with hashed passwords
const seedUsers = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("🚀 Connected to MongoDB");

    await User.deleteMany(); // Clear existing users



    // Hash passwords before inserting users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await getPassword(user.password), // Hash password
      }))
    );

    await User.insertMany(hashedUsers); // Insert new users with hashed passwords
    console.log("✅ Users seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
  }
};

// Run the function if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUsers();
}

export default seedUsers;
