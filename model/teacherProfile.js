import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true},
        
    fullName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String }, 
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    address: { type: String },
    dob: { type: Date },
    gender: { type: String },
    status: {
        type:String,
        enum:["submitted", "approved", "rejected"],
        default:"submitted"
    }
}, { timestamps: true });

const TeacherProfile = mongoose.model('TeacherProfile', teacherProfileSchema);
export default TeacherProfile;