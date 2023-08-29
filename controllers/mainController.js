import Amount from "../models/amount.js"
import User from "../models/user.js"

export const monthTotal = async(req,res) => {
    // const {username} = req.decoded;
    // const {year, month} = req.body;

    // const user = await Amount.findOne({username: username, date: year,})
    // .populate({date,type,money}).exec((err,data) => {
    //     console.log(data);
    // });

    // user

    res.send("monthTotal");
}

export const getGoal = (req,res) => {
    res.send("getGoal");
}

export const postGoal = async (req,res) => {
    const {username} = req.decoded
    const {year, month, goal_money} = req.body;
    const date = year+month;
    
    try{
        const user_name = await User.findOne({username: username});
        
        await Amount.create({date: date, goal_money: goal_money, username: user_name});

        res.status(200).json({
            result: "Y",
            code: 200,
            message: "목표 금액 생성 성공"
        })
    } catch (error) {
        res.status(400).json({
            result: "N",
            code: 400,
            message: "목표 금액 생성 실패",
            error: error
        });
    }

}

export const putGoal = (req,res) => {
    res.send("putGoal");
}

export const category = (req,res) => {
    res.send("category");
}

export const dailylist = (req,res) => {
    res.send("dailylist");
}

export const calendar = (req,res) => {
    res.send("calendar");
}

export const getDetails = (req,res) => {
    res.send("getDetails");
}

export const postDetails = (req,res) => {
    res.send("postDetails");
}

export const putDetails = (req,res) => {
    res.send("putDetails");
}

export const badge = (req,res) => {
    res.send("badge");
}