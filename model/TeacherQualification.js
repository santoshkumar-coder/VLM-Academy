import mongoose from "mongoose";

const teacherQualificationSchema = new mongoose.Schema({
teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
    ,
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
        trim:  true
    }

    

}, {
    timestamps: true
});

const TeacherQualification = mongoose.model(
  "TeacherQualification",
  teacherQualificationSchema,
);

export default TeacherQualification;
