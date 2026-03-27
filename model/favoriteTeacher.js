import mongoose from "mongoose";

const studentFavoriteTeacherSchema = new mongoose.Schema({
studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

export default mongoose.model(
  "StudentFavoriteTeacher",
  studentFavoriteTeacherSchema
);