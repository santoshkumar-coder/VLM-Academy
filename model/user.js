import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
    type: String,
    enum: ["student", "teacher", "admin"]
  },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    }


})
export default mongoose.model("User", userSchema)