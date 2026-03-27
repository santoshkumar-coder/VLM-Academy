import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schoolName: {
    type: String,
  },
  parentName: {
    type: String,
    required: true,
    trim: true,
  },
  parentContact: {
    type: String,
    trim: true,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  referralCode: {
    type: String,
    trim: true,
  },
  class: {
    type: String,
    trim: true,
    required: true,
  },
  language: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  subject: {
    type: [String],
    required: true,
  },

  creditPoint: {
    type: Number,
    default: 0,
  },
  streakStatus: {
    type: String,
  },
  recentSession: {
    type: [String],
    trim: true,
    default: [],
  },
  favoriteSession: {
    type: [String],
    trim: true,
    default: [],
  },
});

export default mongoose.model("StudentProfile", studentProfileSchema);
