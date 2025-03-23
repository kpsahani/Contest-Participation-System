import ContestRepository from '../repositories/ContestRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import redisClient from '../config/redis.js';

class ContestService {
  async createContest(contestData) {
    return ContestRepository.create(contestData);
  }

  async getAllContests() {
    return ContestRepository.find({});
  }

  async getContestsByStatus(status) {
    return ContestRepository.find({ status });
  }

  async getNormalContests() {
    // Get only normal contests for regular users
    return ContestRepository.findByAccessLevel('normal');
  }

  async getContestsByFilter(filter) {
    // Get only normal contests for regular users
    return ContestRepository.findByFilter(filter);
  }

  async getContestById(contestId) {
    return ContestRepository.findById(contestId);
  }

  async joinContest(contestId, userId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    if (new Date() > contest.endDate) {
      throw new Error('Contest has ended');
    }

    const isParticipant = contest.participants.some(
      p => p.user.toString() === userId.toString()
    );
    if (isParticipant) {
      throw new Error('Already joined this contest');
    }

    await ContestRepository.joinContest(contestId, userId);
    await UserRepository.updateById(userId, {
      $addToSet: { contestsParticipated: contestId }
    });

    return { message: 'Successfully joined the contest' };
  }

  async submitAnswers(contestId, userId, submittedAnswers) {
    // Fetch the contest with questions
    const contest = await ContestRepository.findByIdWithQuestions(contestId);
    if (!contest) throw new Error("Contest not found");

    // Check if the contest has ended
    if (new Date() > contest.endDate) throw new Error("Contest has ended");

    // Find participant
    const participant = contest.participants.find(
      (p) => p.user.toString() === userId.toString()
    );
    // if (!participant) throw new Error("Not registered for this contest");

    // Prevent multiple submissions
    if (participant && participant?.completed) throw new Error("Already submitted answers");

    // Calculate the score
    const { totalScore, validatedAnswers } = this.calculateScore(contest, submittedAnswers);

    // Update participant's answers & score in the contest
    const updatedContest = await ContestRepository.submitAnswers(contestId, userId, validatedAnswers, totalScore);
    
    console.log("updatedContest", updatedContest);
    

    // Get the user's final score
    const finalScore = updatedContest.participants.find(
      (p) => p.user.toString() === userId.toString()
    ).score;

    // Update the user's total points
    await UserRepository.updatePoints(userId, finalScore);

    // Update the leaderboard asynchronously
    setTimeout(() => this.updateLeaderboardCache(contestId), 0);

    return { score: totalScore };
  }

  // Validate answers and calculate score
  calculateScore(contest, submittedAnswers) {
    let totalScore = 0;
    const validatedAnswers = [];

    for (const submitted of submittedAnswers) {
        const question = contest.questions.find((q) => q._id.toString() === submitted.questionId);
        if (!question) continue; // Skip invalid question IDs

        
        
        const correctAnswers = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.text);
        const userAnswers = Array.isArray(submitted.selectedAnswer) ? submitted.selectedAnswer : [submitted.selectedAnswer];
        
        console.log("question", question);
        console.log("userAnswers", userAnswers, correctAnswers);
        const isCorrect =
            question.questionType === "multi-select"
                ? userAnswers.length === correctAnswers.length &&
                  userAnswers.every((ans) => correctAnswers.includes(ans))
                : correctAnswers.includes(userAnswers[0]);

        const points = isCorrect ? question.points : 0;
        totalScore += points;

        validatedAnswers.push({
            questionId: question._id,
            answers: userAnswers, // Ensure consistency in storage
            isCorrect,
            points,
            submittedAt: new Date(),
        });
    }

    return { totalScore, validatedAnswers };
}

  async getContestLeaderboard(contestId) {
    const cacheKey = `leaderboard:contest:${contestId}`;
    const cachedLeaderboard = await redisClient.get(cacheKey);

    if (cachedLeaderboard) {
      return JSON.parse(cachedLeaderboard);
    }

    const leaderboard = await ContestRepository.getLeaderboard(contestId);
    if (leaderboard) {
      await redisClient.set(cacheKey, JSON.stringify(leaderboard), {
        EX: 300 // Cache for 5 minutes
      });
    }    

    return leaderboard;
  }

  async getGlobalLeaderboard() {
    const cacheKey = 'leaderboard:global';
    const cachedLeaderboard = await redisClient.get(cacheKey);

    if (cachedLeaderboard) {
      return JSON.parse(cachedLeaderboard);
    }

    const leaderboard = await ContestRepository.getLeaderboard();
    if (leaderboard) {
      await redisClient.set(cacheKey, JSON.stringify(leaderboard), {
        EX: 300 // Cache for 5 minutes
      });
    }

    return leaderboard;

  }

  async updateLeaderboardCache(contestId) {
    const leaderboard = await ContestRepository.getLeaderboard(contestId);
    if (leaderboard) {
      await redisClient.set(
        `leaderboard:contest:${contestId}`,
        JSON.stringify(leaderboard),
        { EX: 300 }
      );
    }

    this.getGlobalLeaderboard();
  }

  async assignQuestions(contestId, questionIds) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) throw new Error("Contest not found");

    contest.questions.push(...questionIds);
    await contest.save();

    return contest;
  }

  async assignQuestionsToContest(contestId, questionIds) {
    return await ContestRepository.assignQuestions(contestId, questionIds);
  }

  async getContestWithQuestions(contestId) {
    return await ContestRepository.findByIdWithQuestions(contestId);
  }

  async distributePrizes(contestId){
    try {
      const contest = await ContestRepository.findByIdWithPopulate(contestId, "participants.user");
  
      if (!contest) throw new Error("❌ Contest not found");
      if (contest.endDate > new Date()) throw new Error("❌ Contest is still ongoing");
  
      // ✅ Step 3: Sort participants by score (Descending)
      contest.participants.sort((a, b) => b.score - a.score);
  
      const prizeWinners = [];
  
      // ✅ Step 4: Assign prizes based on contest's prize distribution
      contest.prize.distribution.forEach((prize) => {
        const winner = contest.participants[prize.rank - 1]; // Rank 1 = index 0, Rank 2 = index 1, etc.
  
        if (winner) {
          prizeWinners.push({
            userId: winner.user._id,
            username: winner.user.username,
            prizeAmount: prize.amount,
            prizeDescription: prize.description
          });
  
          // ✅ Step 5: Update the User Model to Store Prizes Won
          User.findByIdAndUpdate(winner.user._id, {
            $push: {
              prizesWon: {
                contestId,
                amount: prize.amount,
                description: prize.description,
                dateWon: new Date()
              }
            }
          }).exec();
        }
      });
  
      console.log("🏆 Prize Distribution Completed:", prizeWinners);
      return prizeWinners;
    } catch (error) {
      console.error("❌ Error in prize distribution:", error);
      throw error;
    }
  };
}

export default new ContestService();
