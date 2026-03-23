import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherProfile',
        required: true
    },
    interviewDate: {
        type: Date, 
        required: [true, 'Interview date is required']
    },
    interviewTime: {
        type: [String], 
        required: [true, 'Interview time is required']
    },
    interviewDay: {
        type: String, 
        required: [true, 'Interview day is required']
    }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;