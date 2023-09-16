import mongoose from "mongoose";
//import sequence from "mongoose-sequence";
//const seq = sequence(mongoose);

const amountSchema = new mongoose.Schema({
    content: { type: String },
    money: { type: Number },
    type: {
        type: String,
        enum : ['in', 'out']
    },
    //goal_money: { type:String },
    category: { 
        type: String,
        enum: ['eat','cafe','pleasure','shopping','etc']
    },
    regDate: {
        type: String,
        default: Date.now
    },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Amount = mongoose.model("Amount", amountSchema);

export default Amount;