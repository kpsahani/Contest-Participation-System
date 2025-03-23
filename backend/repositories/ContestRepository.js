import BaseRepository from './BaseRepository.js';
import Contest from '../models/Contest.js';

class ContestRepository extends BaseRepository {
  constructor() {
    super(Contest);
  }

  async getActiveContests() {
    const now = new Date();
    return this.model.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }

  async findByAccessLevel(accessLevel) {
    const now = new Date();
    return this.model.find({
      accessLevel,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }

  async findByFilter(filter) {

    const now = new Date();
    return this.model.find({ 
      startDate: { $lte: now },
      endDate: { $gte: now },
      ...filter
    });
  }


  async joinContest(contestId, userId) {
    return this.model.findByIdAndUpdate(
      contestId,
      {
        $addToSet: {
          participants: { user: userId }
        }
      },
      { new: true }
    );
  }

  async submitAnswers(contestId, userId, validatedAnswers, totalScore) {
    return await Contest.findOneAndUpdate(
      { _id: contestId, "participants.user": userId },
      {
        $set: {
          "participants.$.submittedAnswers": validatedAnswers,
          "participants.$.score": totalScore,
          "participants.$.completed": true,
          "participants.$.submittedAt": new Date(),
        },
      },
      { new: true }
    );
  }

  async getLeaderboard(contestId = null) {

    try {
      if (contestId) {
        return this.model.findById(contestId)
          .select('participants')
          .populate('participants.user', 'username')
          .then(contest => {
            if (!contest) return [];

            // console.log("vip contest", contest);
            
            return contest.participants
              .sort((a, b) => b.score - a.score)
              .map(p => ({
                username: p.user.username,
                score: p.score,
                submittedAt: p.submittedAt
              }));
          });
      } else {
        return this.model.find()
        .select('title participants')
        .populate('participants.user', 'username')
        .then(contests => {
          if (!contests || contests.length === 0) return [];

          return contests
            .map(contest => contest.participants.length > 0 // Only keep contests with participants
              ? contest.participants.map(p => ({
                  username: p.user?.username || "Unknown",
                  score: p.score || 0,
                  submittedAt: p.submittedAt || null
              }))
              : []
            )
            .flat() // Flatten the array properly
            .sort((a, b) => b.score - a.score); // Sort by highest score
        });
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  }

  async calculateScore(contestId, answers) {
    const contest = await this.findById(contestId);
    if (!contest) return 0;

    return answers.reduce((score, answer, index) => {
      const question = contest.questions[answer.questionIndex];
      if (question && question.correctAnswer === answer.selectedAnswer) {
        return score + question.points;
      }
      return score;
    }, 0);
  }

  async assignQuestions(contestId, questionIds) {
    return await Contest.findByIdAndUpdate(
      contestId,
      { $addToSet: { questions: { $each: questionIds } } }, // Prevents duplicate question IDs
      { new: true }
    );
  }

  async findByIdWithQuestions(contestId) {
    return await Contest.findById(contestId)
      .populate({
        path: "questions",
        select: "-__v -createdAt -updatedAt" // Exclude unnecessary fields
      });
  }

  async findByIdWithPopulate(contestId, populate) {
    return await Contest.findById(contestId)
      .populate(populate);
  }
}

export default new ContestRepository();
