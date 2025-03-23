import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findByUsername(username) {
    return this.findOne({ username });
  }

  async updatePoints(userId, points) {
    return this.model.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );
  }

  async getContestHistory(userId) {
    return this.model.findById(userId)
      .select('contestsParticipated')
      .populate({
        path: 'contestsParticipated',
        select: 'title startDate endDate participants',
        match: { 'participants.user': userId }
      });
  }

  async getPrizesWon(userId) {
    return this.model.findById(userId)
      .select('prizesWon')
      .populate('prizesWon.contestId', 'title');
  }
}

export default new UserRepository();
