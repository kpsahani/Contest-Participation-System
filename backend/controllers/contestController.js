import redisClient from '../config/redis.js';
import ContestService from '../services/ContestService.js';
import QuestionService from '../services/QuestionService.js';

export const createContest = async (req, res, next) => {
  try {
    // Add creator to the contest data
    const { questions, ...restContestData } = req.body;

    const questionData = questions || []; // Default to empty array if undefined
    const createdQuestions = await QuestionService.bulkCreateQuestions(questions);

    const contestData = {
      ...restContestData,
      createdBy: req.user.id,
      questions: createdQuestions.map(({_id})=> _id)
    };
    
    const contest = await ContestService.createContest(contestData);
    res.status(201).json(contest);
  } catch (error) {
    next(error);
  }
};

export const getAllContests = async (req, res) => {
  try {
    const userRole = req?.user?.role || "guest";
    let cacheKey = `contests:${userRole}`;

    // Check if contests are cached
    const cachedContests = await redisClient.get(cacheKey);
    if (cachedContests) {
      console.log("📦 Serving from cache...");
      return res.json(JSON.parse(cachedContests));
    }

    let contests;
    console.log("Fetching contests from database...");

    if (userRole === "admin") {
      contests = await ContestService.getAllContests();
    } else if (userRole === "vip") {
      contests = await ContestService.getAllContests({ status: "published" });
    } else {
      contests = await ContestService.getContestsByFilter({
        accessLevel: "normal",
        status: "published"
      });
    }

    // Store results in cache for 5 minutes (300 seconds)
    await redisClient.set(cacheKey, JSON.stringify(contests), "EX", 300);

    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminContests = async (req, res) => {
  try {
    // Only admins can access this endpoint
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const contests = await ContestService.getAllContests();
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContestById = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await ContestService.getContestById(contestId);
    
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check if user can access this contest
    const userRole = req.user.role;
    if (contest.accessLevel === 'vip' && userRole === 'user') {
      return res.status(403).json({ message: 'This contest is for VIP users only' });
    }

    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user can join this contest
    const contest = await ContestService.getContestById(contestId);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    // Check access level
    if (contest.accessLevel === 'vip' && userRole === 'user') {
      return res.status(403).json({ message: 'This contest is for VIP users only' });
    }

    const result = await ContestService.joinContest(contestId, userId);
    res.json(result);
  } catch (error) {
    console.log("error =>>>>>>>>>", error);
    res.status(500).json({ message: error.message });
  }
};

export const submitAnswers = async (req, res, next) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;

    // Validate answers format
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    for (const answer of answers) {
      // console.log(answer);
    
      if (!answer.questionId || answer.selectedAnswer === undefined || answer.selectedAnswer === null) {
        return res.status(400).json({ 
          message: 'Each answer must have a valid questionId and selectedAnswer' 
        });
      }
    }

    const result = await ContestService.submitAnswers(contestId, userId, answers);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContestLeaderboard = async (req, res, next) => {
  try {
    const { contestId } = req.params;
    let leaderboard;

    if (contestId === 'all') {
      leaderboard = await ContestService.getGlobalLeaderboard();
    } else {
      leaderboard = await ContestService.getContestLeaderboard(contestId);
      if (!leaderboard) {
        return res.status(404).json({ message: 'Contest not found' });
      }
    }

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};

export const updateContestStatus = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'active', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contest = await ContestService.updateContestStatus(contestId, status);
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignQuestionsToContest = async (req, res) => {

  try {
    const { contestId, questionIds } = req.body;
    const updatedContest = await ContestService.assignQuestionsToContest(contestId, questionIds);

    res.status(200).json({
      message: "Questions assigned successfully",
      contest: updatedContest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getContestWithQuestions = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await ContestService.getContestWithQuestions(contestId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const processContestPrizes = async (req, res) => {
  try {
    const { contestId } = req.params;
    const winners = await ContestService.distributePrizes(contestId);
    res.status(200).json({ message: "✅ Prizes distributed successfully", winners });
  } catch (error) {
    res.status(500).json({ message: "❌ Error processing prizes", error: error.message });
  }
};