import express from 'express';
import {
  getQuestionsByContest,
  bulkCreateQuestions
} from '../controllers/questionController.js';
import { protect, admin } from '../middleware/auth.js';
import {
  bulkCreateQuestionsValidation
} from '../validations/questionValidations.js';

const router = express.Router();

// Contest-specific question routes
router.route('/by-contest/:contestId').get(protect, admin, getQuestionsByContest);

router.post('/bulk', protect, admin, bulkCreateQuestionsValidation, bulkCreateQuestions)

export default router;
