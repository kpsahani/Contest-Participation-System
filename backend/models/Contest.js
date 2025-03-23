import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    accessLevel: { type: String, enum: ["normal", "vip"], default: "normal" },

    difficultyLevel: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"], 
      default: "intermediate" 
    },

    maxParticipants: { type: Number, default: 100 },

    status: { type: String, enum: ["draft", "published", "completed"], default: "draft" },

    // Prize structure with distribution
    prize: {
      title: String,
      description: String,
      value: Number,
      distribution: [
        {
          rank: Number, // Rank of the winner
          amount: Number, // Prize money or points
          description: String,
        },
      ],
    },

    rules: [{ type: String }], // Contest rules

    // Questions assigned to the contest
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: { type: Date, default: Date.now },
        score: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
        submittedAt: { type: Date, default: Date.now },
        submittedAnswers: [
          {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
            answers: [String], // Stores user-selected answers
            isCorrect: Boolean,
            points: Number,
            submittedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure contest dates are valid
contestSchema.pre("save", function (next) {
  if (this.startDate >= this.endDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
