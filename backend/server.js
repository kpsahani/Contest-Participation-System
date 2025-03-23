import dotenv from 'dotenv';
import connectDB from './config/db.js';
import './config/redis.js';
import app from './app.js';
import "./cronjob/index.js"

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});