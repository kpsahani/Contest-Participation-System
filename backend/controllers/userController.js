import UserService from '../services/UserService.js';

export const getContestHistory = async (req, res, next) => {
  try {
    const history = await UserService.getContestHistory(req.params.userId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const getPrizesWon = async (req, res, next) => {
  try {
    const prizes = await UserService.getPrizesWon(req.params.userId);
    res.json(prizes);
  } catch (error) {
    next(error);
  }
};
