import mongoose from "mongoose";
import moment from "moment";
import sequence from "mongoose-sequence";
const seq = sequence(mongoose);

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
    date:{
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },
    username: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Amount = mongoose.model("Amount", amountSchema);

amountSchema.plugin(seq, {inc_field: 'amount_nm'});

export default Amount;