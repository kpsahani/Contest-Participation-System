import QuestionRepository from '../repositories/QuestionRepository.js';
import ContestRepository from '../repositories/ContestRepository.js';
import QuestionService from '../services/QuestionService.js';

export const createQuestion = async (req, res) => {
  const { contestId } = req.params;
  const contest = await ContestRepository.findById(contestId);
  
  if (!contest) {
    res.status(404);
    throw new Error('Contest not found');
  }

  // Check if contest is in draft status
  if (contest.status !== 'draft') {
    res.status(400);
    throw new Error('Questions can only be added to contests in draft status');
  }

  const question = await QuestionRepository.create({
    ...req.body,
    contestId,
    createdBy: req.user._id
  });

  res.status(201).json(question);
};

export const getQuestionsByContest = async (req, res) => {
  const { contestId } = req.params;
  const questions = await QuestionRepository.getQuestionsByContest(contestId);
  res.json(questions);
};

export const updateQuestion = async (req, res) => {
  const question = await QuestionRepository.findById(req.params.id);
  
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Check if contest is in draft status
  const contest = await ContestRepository.findById(question.contestId);
  if (contest.status !== 'draft') {
    res.status(400);
    throw new Error('Questions can only be modified for contests in draft status');
  }

  const updatedQuestion = await QuestionRepository.updateById(
    req.params.id,
    req.body
  );

  res.json(updatedQuestion);
};


export const deleteQuestion = async (req, res) => {
  const question = await QuestionRepository.findById(req.params.id);
  
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Check if contest is in draft status
  const contest = await ContestRepository.findById(question.contestId);
  if (contest.status !== 'draft') {
    res.status(400);
    throw new Error('Questions can only be deleted for contests in draft status');
  }

  await QuestionRepository.deleteById(req.params.id);
  res.json({ message: 'Question deleted successfully' });
};


export const bulkCreateQuestions = async (req, res) => {
  const { questions } = req.body;

  const createdQuestions = await QuestionService.bulkCreateQuestions(questions);

  res.status(201).json(createdQuestions);
};

