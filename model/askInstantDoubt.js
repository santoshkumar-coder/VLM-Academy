import mongoose from "mongoose";


const askInstantDoubtSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject:{
        type:String,
        required:true
    },
    chapter:{
        type:String,
        required:true
    },
    discrption:{
         type:String,
        required:true
    },
    sessionType: {
        type: String,
        required: true
    },
   
    image:{
        type: [String],
        
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const AskInstantDoubt = mongoose.model('AskInstantDoubt', askInstantDoubtSchema);
export default AskInstantDoubt;