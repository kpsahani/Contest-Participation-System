import cron from "node-cron";
import ContestService from "../services/ContestService.js";
import ContestRepository from "../repositories/ContestRepository.js";

// Runs every 5 seconds
cron.schedule("*/5 * * * *", async () => {
  console.log("Checking for finished contests...");
  const finishedContests = await ContestRepository.findByFilter({ endDate: { $lte: new Date() } });

  console.log(`Found ${finishedContests.length} contests that have finished.`);

  for (const contest of finishedContests) {
    try {
      console.log(`Processing prizes for contest: ${contest.title}`);
      await ContestService.distributePrizes(contest._id);
    } catch (error) {
      console.error("Error processing contest prizes:", error);
    }
  }
});
