import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Contest from '../models/Contest.js';

dotenv.config();

const setupTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://contestsystem:8ftRpy01uystMpqZ@avater-kp-local.5yidt.mongodb.net/contestsystemtest?retryWrites=true&w=majority&appName=avater-kp-local');
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany({});
    await Contest.deleteMany({});

    // Create test users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });

    const vipUser = await User.create({
      username: 'vipuser',
      email: 'vip@test.com',
      password: 'vip123',
      role: 'vip'
    });

    const normalUser = await User.create({
      username: 'normaluser',
      email: 'normal@test.com',
      password: 'normal123',
      role: 'user'
    });

    // Create test contests
    const normalContest = await Contest.create({
      title: 'Normal Contest',
      description: 'A contest for all users',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      accessLevel: 'normal',
      questions: [
        {
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          points: 1
        }
      ]
    });

    const vipContest = await Contest.create({
      title: 'VIP Contest',
      description: 'A contest for VIP users only',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      accessLevel: 'vip',
      questions: [
        {
          question: 'What is 3×3?',
          options: ['6', '7', '8', '9'],
          correctAnswer: 3,
          points: 2
        }
      ]
    });

    console.log('Test data created successfully!');
    console.log('\nTest Users:');
    console.log('Admin - Email: admin@test.com, Password: admin123');
    console.log('VIP User - Email: vip@test.com, Password: vip123');
    console.log('Normal User - Email: normal@test.com, Password: normal123');
    console.log('\nTest Contests Created:');
    console.log(`Normal Contest ID: ${normalContest._id}`);
    console.log(`VIP Contest ID: ${vipContest._id}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

setupTestData();
