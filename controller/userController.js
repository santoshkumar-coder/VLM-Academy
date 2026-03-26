import bcrypt from "bcrypt";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import StudentProfile from "../model/studentProfile.js";
import ErrorHandler from "../util/errorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { createDoubtService } from "../service/askInstantDoubtService.js";

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
  await user.save();

  if(role === 'student') {
 await StudentProfile.create({
      userId: user._id,
      schoolName,
      parentName,
      parentContact,
      city,
      username,
      referralCode,
      class: studentClass,
    })
  };

  

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
      const { userId } = req.params;
      const updates = req.body;


      const { name, gender, email, ...profileData } = updates;

      const userUpdates = {};
      if (name) userUpdates.name = name;
      if (gender) userUpdates.gender = gender;
      if (email) userUpdates.email = email;

      delete profileData.userId;
      delete profileData.createdAt;

      let updatedUser;
      if (Object.keys(userUpdates).length > 0) {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: userUpdates },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ message: "User not found." });
        }
      }

      const updatedProfile = await StudentProfile.findOneAndUpdate(
        { userId: userId },
        { $set: profileData },
        { new: true, runValidators: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Student profile not found." });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        data: {
          user: updatedUser || "No changes in basic info",
          profile: updatedProfile,
        },
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

  askDoubt: async (req, res, next) => {
    const studentId = req.userId;
    const { subject, chapter, discrption, sessionType } = req.body;

    const imageUrls = req.files?.map((file) => file.path) || [];

    if (!studentId || !subject || !chapter || !discrption || !sessionType) {
      return next(new ErrorHandler("All required fields are required", 400));
    }

    const doubt = await createDoubtService({
      studentId,
      subject,
      chapter,
      discrption,
      sessionType,
      image: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Doubt created successfully",
      data: doubt,
    });
  },

};

export default userController;
