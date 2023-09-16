import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    goal_money: {type:String},
    regDate: {
        type: String,
        default: Date.now
    },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})