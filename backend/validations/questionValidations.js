import { body } from "express-validator";

export const bulkCreateQuestionsValidation = [
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
    .custom((options, { req, path }) => {
      const questionType = req.body.questions[path.split(".")[1]].questionType;
      
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
