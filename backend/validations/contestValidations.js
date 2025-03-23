import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import QuestionRepository from '../repositories/QuestionRepository.js';
import ContestRepository from '../repositories/ContestRepository.js';
import { bulkCreateQuestionsValidation } from './questionValidations.js';

export const createContestValidation = [
  // Contest Fields
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("accessLevel").isIn(["normal", "private"]).withMessage("Invalid access level"),
  body("difficultyLevel").isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid difficulty level"),
  body("maxParticipants").isInt({ min: 1 }).withMessage("Max participants must be a positive integer"),
  body("status").isIn(["draft", "published", "archived"]).withMessage("Invalid status"),
  body("rules")
    .isArray()
    .withMessage("Rules must be an array")
    .custom((rules) => {
      if (!rules.every((rule) => typeof rule === "string" && rule.trim() !== "")) {
        throw new Error("Each rule must be a non-empty string");
      }
      return true;
    }),

  // Prize Validation
  body("prize.title").trim().notEmpty().withMessage("Prize title is required"),
  body("prize.description").trim().notEmpty().withMessage("Prize description is required"),
  body("prize.value").isNumeric({ min: 1 }).withMessage("Prize value must be a positive number"),
  body("prize.distribution")
    .isArray({ min: 1 })
    .withMessage("Prize distribution must be an array with at least one item"),


  // Questions Validation
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),

  body("questions.*.questionText")
    .trim()
    .notEmpty()
    .withMessage("Question text is required")
    .isLength({ max: 1000 })
    .withMessage("Question text cannot exceed 1000 characters"),

  body("questions.*.questionType")
    .isIn(["single-select", "multi-select", "true-false"])
    .withMessage("Invalid question type"),

  body("questions.*.options")
    .isArray({ min: 2 })
    .withMessage("Each question must have at least 2 options")
    .custom((options, { req, pathValues}) => {
      const questionType = req.body.questions[pathValues[0]].questionType;

      // True/False validation
      if (questionType === "true-false") {
        if (options.length !== 2) {
          throw new Error("True/False questions must have exactly 2 options");
        }

        const optionTexts = options.map((opt) => opt.text.toLowerCase());
        if (!optionTexts.includes("true") || !optionTexts.includes("false")) {
          throw new Error('True/False questions must have "True" and "False" as options');
        }

        const correctAnswers = options.filter((opt) => opt.isCorrect);
        if (correctAnswers.length !== 1) {
          throw new Error("True/False questions must have exactly one correct answer");
        }
      }

      // Single-Select validation
      if (questionType === "single-select") {
        const correctAnswers = options.filter((opt) => opt.isCorrect);
        if (correctAnswers.length !== 1) {
          throw new Error("Single-select questions must have exactly one correct answer");
        }
      }

      // Multi-Select validation
      if (questionType === "multi-select") {
        const correctAnswers = options.filter((opt) => opt.isCorrect);
        if (correctAnswers.length < 1) {
          throw new Error("Multi-select questions must have at least one correct answer");
        }
      }

      return true;
    }),

  body("questions.*.options.*.text")
    .trim()
    .notEmpty()
    .withMessage("Option text is required")
    .isLength({ max: 500 })
    .withMessage("Option text cannot exceed 500 characters"),

  body("questions.*.options.*.isCorrect")
    .isBoolean()
    .withMessage("isCorrect must be a boolean value"),

  body("questions.*.points")
    .isInt({ min: 1 })
    .withMessage("Points must be a positive integer"),

  body("questions.*.difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Invalid difficulty level"),

  body("questions.*.timeLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Time limit must be a non-negative integer"),
];


export const submitAnswersValidation = [
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  
  body('answers.*.questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid question ID format'),
  
  body('answers.*.selectedAnswer')
    .notEmpty()
];


export const assignQuestionsValidation = [
  body("contestId")
    .notEmpty()
    .withMessage("contestId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid contestId format")
    .custom(async (value) => {
      const contestExists = await ContestRepository.findById(value);
      if (!contestExists) {
        return Promise.reject("Contest not found");
      }
    }),

  body("questionIds")
    .isArray({ min: 1 })
    .withMessage("At least one questionId is required")
    .custom((questionIds) => {
      if (!questionIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid questionId format");
      }
      return true;
    })
    .custom(async (questionIds) => {
      const foundQuestions = await QuestionRepository.find({ _id: { $in: questionIds } });
      if (foundQuestions.length !== questionIds.length) {
        throw new Error("Some questionIds do not exist in the database");
      }
    }),
];


export const validateContestId = [
  param("contestId")
    .notEmpty()
    .withMessage("contestId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid contestId format")
    .custom(async (value) => {
      const contestExists = await ContestRepository.findById(value);
      if (!contestExists) {
        return Promise.reject("Contest not found");
      }
    }),
];