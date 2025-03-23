import BaseRepository from './BaseRepository.js';
import Question from '../models/Question.js';

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }

  async getQuestionsByContest(contestId) {
    return this.model.find({ contestId }).sort('createdAt');
  }

  async validateAnswers(questionId, submittedAnswers) {
    const question = await this.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const correctAnswers = question.options
      .filter(option => option.isCorrect)
      .map(option => option.text);

    if (question.questionType === 'single-select' || question.questionType === 'true-false') {
      // For single-select and true-false, only one answer should be submitted
      if (!Array.isArray(submittedAnswers) || submittedAnswers.length !== 1) {
        return { isCorrect: false, points: 0 };
      }
      return {
        isCorrect: correctAnswers.includes(submittedAnswers[0]),
        points: correctAnswers.includes(submittedAnswers[0]) ? question.points : 0
      };
    }

    if (question.questionType === 'multi-select') {
      // For multi-select, all correct answers must be selected and no incorrect ones
      const isCorrect = 
        submittedAnswers.length === correctAnswers.length &&
        submittedAnswers.every(answer => correctAnswers.includes(answer)) &&
        correctAnswers.every(answer => submittedAnswers.includes(answer));
      
      return {
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    }

    throw new Error('Invalid question type');
  }

  async bulkCreate(questions) {
    return this.model.insertMany(questions);
  }
}

export default new QuestionRepository();
