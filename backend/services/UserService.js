import UserRepository from '../repositories/UserRepository.js';

class UserService {
  async getContestHistory(userId) {
    const history = await UserRepository.getContestHistory(userId);
    if (!history) {
      throw new Error('User not found');
    }

    return history.contestsParticipated.map(contest => ({
      id: contest._id,
      title: contest.title,
      startDate: contest.startDate,
      endDate: contest.endDate,
      score: contest.participants.find(
        p => p.user.toString() === userId.toString()
      )?.score || 0
    }));
  }

  async getPrizesWon(userId) {
    const prizes = await UserRepository.getPrizesWon(userId);
    if (!prizes) {
      throw new Error('User not found');
    }

    return prizes.prizesWon.map(prize => ({
      contestTitle: prize.contestId.title,
      prize: prize.prize,
      dateWon: prize.dateWon
    }));
  }
}

export default new UserService();
