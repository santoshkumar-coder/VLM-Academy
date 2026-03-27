import mongoose from 'mongoose';

const teacherStatusSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['online', 'offline', 'busy'], default: 'offline', lowercase: true },
    lastActive: { type: Date, default: Date.now },
    updatedBy: { type: String, enum: ['teacher', 'admin', 'system'], default: 'teacher' },
     actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const TeacherStatus = mongoose.model('TeacherStatus', teacherStatusSchema);
export default TeacherStatus;