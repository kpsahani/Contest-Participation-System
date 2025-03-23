import express from 'express';
import { getContestHistory, getPrizesWon } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(apiLimiter);

// Protected routes - require authentication
router.use(protect);

// Get user's contest history
router.get('/:userId/history', getContestHistory);

router.get('/:userId/prizes', getPrizesWon);

export default router;
