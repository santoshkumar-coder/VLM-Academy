import bcrypt from "bcrypt";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import StudentProfile from "../model/studentProfile.js";
import ErrorHandler from "../util/errorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

const userController = {
  register: catchAsyncError(async (req, res, next) => {
    const {
      name,
      email,
      password,
      gender,
      role,
      schoolName,
      parentName,
      parentContact,
      city,
      username,
      referralCode,
      class: studentClass,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      role,
    });

    const studentProfile = await StudentProfile.create({
      userId: user._id,
      schoolName,
      parentName,
      parentContact,
      city,
      username,
      referralCode,
      class: studentClass,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }),

  login: catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
      token,
    });
  }),
  getProfile: async (req, res) => {
    try {
      const userId = req.userId;
      console.log("User ID from token:", userId);
      const user = await User.findById(userId).select("-password");
      const studentProfile = await StudentProfile.findOne({ userId });

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
          ...user._doc,
          ...studentProfile?._doc,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  updateStudentProfile: async (req, res) => {
    try {
      const { userId } = req.params; // Or get it from req.user.id if using Auth middleware
      const updates = req.body;

      // 1. Prevent sensitive fields from being updated manually if necessary
      delete updates.userId;
      delete updates.createdAt;

      const updatedProfile = await StudentProfile.findOneAndUpdate(
        { userId: userId },
        { $set: updates },
        { new: true, runValidators: true },
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Student profile not found." });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating profile",
        error: error.message,
      });
    }
  },

  deleteStudentProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedData = await StudentProfile.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(404).json({
          success: false,
          message: "Data not found!",
        });
      }
      res.status(200).json({
        success: true,
        message: "Data deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting data",
        error: error.message,
      });
    }
  },
};

export default userController;
