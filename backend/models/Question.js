import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: false, // Now optional so questions can exist without a contest
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      required: true,
      enum: ["single-select", "multi-select", "true-false"],
      default: "single-select",
    },
    options: {
      type: [
        {
          text: {
            type: String,
            required: true,
            trim: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
      ],
      validate: {
        validator: function (options) {
          if (!Array.isArray(options) || options.length < 2) {
            return false;
          }

          const correctOptions = options.filter((opt) => opt.isCorrect);

          // True/False questions must have exactly 2 options: "True" & "False"
          if (this.questionType === "true-false") {
            const texts = options.map((opt) => opt.text.toLowerCase());
            return (
              texts.includes("true") &&
              texts.includes("false") &&
              correctOptions.length === 1
            );
          }

          // Single-select must have exactly one correct answer
          if (this.questionType === "single-select") {
            return correctOptions.length === 1;
          }

          // Multi-select must have at least one correct answer
          return correctOptions.length >= 1;
        },
        message: "Invalid options: Ensure valid options based on question type.",
      },
    },
    points: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    explanation: {
      type: String,
      trim: true,
      default: null, // Default to null instead of an empty string
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    timeLimit: {
      type: Number, // Time limit in seconds
      min: 0,
      default: 0, // 0 means no time limit
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Method to check if the submitted answer is correct
questionSchema.methods.checkAnswer = function (submittedAnswers) {
  if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
    return false; // Invalid answer format
  }

  if (this.questionType === "true-false" || this.questionType === "single-select") {
    // For single-select and true/false, exactly one answer must be submitted
    if (submittedAnswers.length !== 1) return false;

    const correctOption = this.options.find((opt) => opt.isCorrect);
    return correctOption && correctOption.text === submittedAnswers[0];
  }

  // Multi-select: Validate that all correct answers are selected
  const correctAnswers = this.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.text);

  return (
    correctAnswers.length === submittedAnswers.length &&
    correctAnswers.every((ans) => submittedAnswers.includes(ans))
  );
};

const Question = mongoose.model("Question", questionSchema);

export default Question;
