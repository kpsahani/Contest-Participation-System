import QuestionRepository from '../repositories/QuestionRepository.js';

class QuestionService {
  
  async bulkCreateQuestions(questionsData) {
    return await QuestionRepository.bulkCreate(questionsData);
  }

}

export default new QuestionService();
