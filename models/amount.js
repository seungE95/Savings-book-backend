import mongoose from "mongoose";
import sequence from "mongoose-sequence";
const seq = sequence(mongoose);
//import moment from "moment";

const amountSchema = new mongoose.Schema({
    amount_nm: { type: Number },
    content: { type: String },
    money: { type: Number },
    type: {
        type: String,
        enum : ['in', 'out']
    },
    goal_money: { type:String },
    category: { type: String },
    regDate: {
        type: String,
        default: Date.now
    },
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Amount = mongoose.model("Amount", amountSchema);

amountSchema.plugin(seq, {inc_field: "amount_nm"});

export default Amount;