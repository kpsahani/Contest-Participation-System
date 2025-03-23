import mongoose from "mongoose";
import dotenv from "dotenv";
import Contest from "../models/Contest.js";
import Question from "../models/Question.js";

dotenv.config();

const contests = [
  {
    title: "JavaScript Basics",
    description: "Test your JavaScript skills",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    accessLevel: "normal",
    difficultyLevel: "intermediate",
    maxParticipants: 100,
    status: "published",
    questions: []
  },
  {
    title: "Advanced React",
    description: "Test your React knowledge",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    accessLevel: "vip",
    difficultyLevel: "intermediate",
    maxParticipants: 50,
    status: "published",
    questions: []
  }
];

const questions = [
  {
    questionText: "What is 2+2?",
    questionType: "single-select",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true }
    ],
    points: 5,
    timeLimit: 30
  },
  {
    questionText: "Which of these are JavaScript frameworks?",
    questionType: "multi-select",
    options: [
      { text: "React", isCorrect: true },
      { text: "Vue", isCorrect: true },
      { text: "Java", isCorrect: false }
    ],
    points: 10,
    timeLimit: 45
  }
];

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

const seedContests = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("🚀 Connected to MongoDB");

    // 2️⃣ Clear previous data
    await Contest.deleteMany();
    await Question.deleteMany();

    // 3️⃣ Insert Questions and Get IDs
    const createdQuestions = await Question.insertMany(questions);
    const questionIds = createdQuestions.map((q) => q._id);

    console.log("✅ Questions seeded successfully!", questionIds);

    // 4️⃣ Assign Question IDs to Contests
    contests[0].questions = [questionIds[0]]; // First contest gets the first question
    contests[1].questions = [questionIds[1]]; // Second contest gets the second question

    // 5️⃣ Insert Contests
    const createdContests = await Contest.insertMany(contests);
    console.log("✅ Contests seeded successfully!");

    console.log("\n🎯 Seeded Data:");
    createdContests.forEach((contest) =>
      console.log(`📌 Contest: ${contest.title}, ID: ${contest._id}`)
    );

  } catch (error) {
    console.error("❌ Error seeding contests:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
  }
};

// Run the function if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedContests();
}

export default seedContests;
