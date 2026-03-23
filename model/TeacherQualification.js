import mongoose from 'mongoose';

const teacherQualificationSchema = new mongoose.Schema({
    highestQualification: {
        type: String,
        required: [true, 'Highest qualification is required'],
        trim: true
    },
    passingYear: {
        type: Number,
        required: [true, 'Passing year is required']
    },
    teachingCertification: {
        type: String,
        trim: true
    },
    isBed: {
        type: Boolean,
        default: false,
        required: [true, 'Please specify if you have a B.Ed degree']
    },
    additionalCertificates: [
        {
            type: String,
            trim: true
        }
    ],
    instituteName: {
        type: String,
        required: [true, 'Institute name is required'],
        trim: true
    },
    experienceStatus: {
        type: String,
        enum: ['fresher', 'experienced'],
        required: true,
        lowercase: true
    },
    totalExperience: {
        type: Number,
        default: 0,
        min: 0
    },
    teachingMode: {
        type: [String], 
        enum: ['School', 'Institute', 'Tuition', 'Online'],
        required: true
    },
    resume: {
        type: String, 
        required: [true, 'Please upload your resume']
    }
}, {
    timestamps: true
});

const TeacherQualification = mongoose.model('TeacherQualification', teacherQualificationSchema);

export default TeacherQualification;