import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import Contest from '../../models/Contest.js';

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    ...userData
  };

  return await User.create(defaultUser);
};

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  );
};

export const createTestContest = async (contestData = {}) => {
  const defaultContest = {
    title: 'Test Contest',
    description: 'Test Description',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    endTime: new Date(Date.now() + 7200000),   // 2 hours from now
    prizes: [1000, 500, 250],
    status: 'draft',
    ...contestData
  };

  return await Contest.create(defaultContest);
};

export const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany({})
      )
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};
