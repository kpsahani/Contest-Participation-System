import seedUsers from "./userSeed.js";
import seedContests from "./contestSeed.js";

const seedDatabase = async () => {
  console.log("🚀 Starting Database Seeding...");
  await seedUsers(); // First, create users
  await seedContests(); // Then, create contests with questions
  console.log("✅ Seeding Completed!");
};

seedDatabase();
