import express from 'express';
import { updateUserRole, getAllUsers } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/users', protect, authorize('admin'), apiLimiter, getAllUsers);

router.patch('/users/:userId/role', protect, authorize('admin'), apiLimiter, updateUserRole);

export default router;
