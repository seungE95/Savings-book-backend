import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const amountSchema = new mongoose.Schema({
    amount_nm: {type:Number},
    content: {type:String},
    money: {type: Number},
    type: {
        type:String,
        enum : ['in', 'out']
    },
    goal_money: {type:String},
    category: {type: String},
    created:{
        type: Date,
        default: Date.now
    },
    username: {type: String}
});

amountSchema.plugin(sequence, {inc_field: "amount_nm"});

const Amount = mongoose.model("Amount", amountSchema);

export default Amount;