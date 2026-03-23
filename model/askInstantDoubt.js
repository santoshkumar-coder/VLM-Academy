import mongoose from "mongoose";


const askInstantDoubtSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stream: {
        type: String,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    genderPrference:{
        type: String,
        enum:['male','female','other'],
        default: 'other'
    },
    statePrference:{
        type: String,
        required: true
    },
    Title:{
        type: String,
        required: true
    
    },
    Description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const AskInstantDoubt = mongoose.model('AskInstantDoubt', askInstantDoubtSchema);
export default AskInstantDoubt;