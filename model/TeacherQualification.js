import mongoose from "mongoose";

const teacherQualificationSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      required: true,
    },
    highestQualification: {
      type: String,
      required: [true, "Highest qualification is required"],
      trim: true,
    },
    passingYear: {
      type: Number,
      required: [true, "Passing year is required"],
    },
    teachingCertification: {
      type: String,
      trim: true,
    },
    isBed: {
      type: Boolean,
      default: false,
      required: [true, "Please specify if you have a B.Ed degree"],
    },
    additionalCertificates: [
      {
        type: String,
        trim: true,
      },
    ],
    instituteName: {
      type: String,
      required: [true, "Institute name is required"],
      trim: true,
    },
    experienceStatus: {
      type: String,
      enum: ["fresher", "experienced"],
      required: true,
      lowercase: true,
    },
    totalExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    teachingMode: {
      type: [String],
      enum: ["School", "Institute", "Tuition", "Online"],
      required: true,
    },
    resume: {
      type: String,
      required: [true, "Please upload your resume"],
    },
    experience: {
      type: String,
      required: true,
    },

    subjects: {
      type: [String],
      required: true,
    },

    classes: {
      type: [String],
      required: true,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    },
    classCategories: {
      type: [String],
      enum: ["Primary", "Middle School", "High School", "Senior High"],
      index: true,
    },

    boards: {
      type: [String],
      required: true,
    },

    languages: {
      type: [String],
      required: true,
    },
    aadharCard: {
      type: String,
      trim: true,
    },
    experienceDocument: {
      type: String,
      trim: true,
    },
    qualificationCertificate: {
      type: String,
      trim: true,
    },
    introVideo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "verfied", "rejected"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  },
);

teacherQualificationSchema.pre("save", async function () {
  if (this.isModified("classes") && Array.isArray(this.classes)) {
    const categories = new Set();

    this.classes.forEach((cls) => {
      const classNum = parseInt(cls);
      if (classNum >= 1 && classNum <= 5) categories.add("Primary");
      else if (classNum >= 6 && classNum <= 8) categories.add("Middle School");
      else if (classNum >= 9 && classNum <= 10) categories.add("High School");
      else if (classNum >= 11 && classNum <= 12) categories.add("Senior High");
    });

    this.classCategories = Array.from(categories);
  }
});

const TeacherQualification = mongoose.model(
  "TeacherQualification",
  teacherQualificationSchema,
);

export default TeacherQualification;
