import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
    dob:{
        type:Date,
        required: true
    },
    mobileNumber:{
        type: String,
        required: true,
        trim : true
    },


})


export default mongoose.model('TeacherProfile', teacherProfileSchema)