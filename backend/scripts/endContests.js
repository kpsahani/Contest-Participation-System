import mongoose from "mongoose";
import dotenv from "dotenv";
import Contest from "../models/Contest.js";
import ContestService from "../services/ContestService.js";

dotenv.config();

// ✅ Function to mark contests as completed and distribute prizes
const endContests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Connected to MongoDB");

    // ✅ Find all contests that have ended but are not marked as completed
    const contestsToEnd = await Contest.find({
      endDate: { $lte: new Date() },
      status: { $ne: "completed" }, // Only process contests that are not already completed
    });

    if (contestsToEnd.length === 0) {
      console.log("✅ No contests to end.");
      return;
    }

    console.log(`🎯 Found ${contestsToEnd.length} contests that need to be ended.`);

    for (const contest of contestsToEnd) {
      console.log(`🔹 Ending contest: ${contest.title} (${contest._id})`);

      // ✅ Distribute prizes for the contest
      await ContestService.distributePrizes(contest._id);

      // ✅ Mark the contest as completed
      contest.status = "completed";
      await contest.save();

      console.log(`✅ Contest ${contest.title} marked as completed.`);
    }

    console.log("🎉 All expired contests have been ended and prizes distributed!");
  } catch (error) {
    console.error("❌ Error ending contests:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB Disconnected");
  }
};

// ✅ Run the function when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  endContests();
}

export default endContests;
