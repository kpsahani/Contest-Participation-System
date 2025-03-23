import express from 'express';
import {
  createContest,
  getAllContests,
  getAdminContests,
  getContestById,
  joinContest,
  submitAnswers,
  getContestLeaderboard,
  updateContestStatus,
  assignQuestionsToContest,
  getContestWithQuestions,
  processContestPrizes
} from '../controllers/contestController.js';
import { protect, authorize, roleFilter } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import {
  assignQuestionsValidation,
  createContestValidation,
  submitAnswersValidation,
  validateContestId,
} from '../validations/contestValidations.js';

const router = express.Router();

// Apply rate limiting to all contest routes
router.use(apiLimiter);

// Admin routes
router.get('/admin', protect, getAdminContests);

/**
 * @swagger
 * /api/contests:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get all contests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, active, completed]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced, expert]
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contests retrieved successfully
 */
router.get('/', roleFilter, getAllContests);

/**
 * @swagger
 * /api/contests/{contestId}:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get a contest by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contest retrieved successfully
 *       404:
 *         description: Contest not found
 */
router.get('/:contestId', protect, getContestById);

/**
 * @swagger
 * /api/contests/{contestId}/join:
 *   post:
 *     tags:
 *       - Contests
 *     summary: Join a contest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully joined the contest
 *       400:
 *         description: Already joined, contest ended, or contest full
 *       403:
 *         description: VIP contest not accessible
 *       404:
 *         description: Contest not found
 */
router.post(
  '/:contestId/join',
  protect,
  authorize('user', 'vip'),
  joinContest
);

/**
 * @swagger
 * /api/contests/{contestId}/submit:
 *   post:
 *     tags:
 *       - Contests
 *     summary: Submit answers for a contest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - selectedAnswers
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedAnswers:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 */
router.post(
  '/:contestId/submit',
  protect,
  submitAnswersValidation,
  validate,
  submitAnswers
);

/**
 * @swagger
 * /api/contests/{contestId}/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     summary: Get contest-specific leaderboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contest leaderboard retrieved successfully
 *       404:
 *         description: Contest not found
 */
router.get('/:contestId/leaderboard', roleFilter, getContestLeaderboard);

/**
 * @swagger
 * /api/contests:
 *   post:
 *     tags:
 *       - Contests
 *     summary: Create a new contest (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               accessLevel:
 *                 type: string
 *                 enum: [normal, vip]
 *               prize:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   value:
 *                     type: number
 *                   distribution:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         rank:
 *                           type: number
 *                         amount:
 *                           type: number
 *                         description:
 *                           type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                     questionType:
 *                       type: string
 *                       enum: [single-select, multi-select, true-false]
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                           isCorrect:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Contest created successfully
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  createContestValidation,
  validate,
  createContest
);

/**
 * @swagger
 * /api/contests/{contestId}/status:
 *   patch:
 *     tags:
 *       - Contests
 *     summary: Update contest status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, published, active, completed]
 */
router.patch(
  '/:contestId/status',
  protect,
  authorize('admin'),
  validate,
  updateContestStatus
);

/**
 * @swagger
 * /api/contests/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     summary: Get global leaderboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Global leaderboard retrieved successfully
 */
router.get('/leaderboard', protect, getContestLeaderboard);

router.post("/assign-questions", protect, authorize('admin'), assignQuestionsValidation, validate, assignQuestionsToContest);

// Get a contest with all its questions
router.get("/:contestId/questions", protect, validateContestId, getContestWithQuestions);

router.post("/:contestId/process-prizes", protect, authorize('admin'), processContestPrizes);

export default router;
