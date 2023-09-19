import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    num: { type: Number, require: true },
    quiz: { type: String, require: true },
    answer: { type:String, require: true }
})

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz