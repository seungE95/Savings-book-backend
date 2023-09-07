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

export const getGoal = async (req, res) => {
    const { username } = req.decoded;
    const { year, month } = req.body;
    const date = year + "-" + month;

    try {
        if (year != null && month != null) {
            const user = await User.findOne({username: username});            
            const amount = await Amount.findOne({username: user._id, regDate:date});
            
            const resYear = amount.regDate.substring(0,4);
            const resMonth = amount.regDate.substring(5,7);

            return res.status(200).json({
                result: "Y",
                code: 200,
                message: "목표 금액 전송 완료",
                data: {
                    date:{
                        year: resYear,
                        month: resMonth
                    },
                    goal_money: amount.goal_money
                }
            });
        }
    } catch (error) { 
        return res.status(400).json({
            result: "N",
            code: 400,
            message: "해당 날짜에 목표 금액이 없음",
        });
    }
}

export const postGoal = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, goal_money } = req.body;
    const date = year + "-" + month;
    
    try{
        const user_name = await User.findOne({username: username});
        const amount = await Amount.create({regDate: date, goal_money: goal_money, username: user_name});
        
        amount.amount_nm + 1;

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

export const putGoal = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, goal_money } = req.body;
    const date = year + "-" + month;
    
    try{
        const user = await User.findOne({username: username});
        await Amount.findOneAndUpdate({regDate: date,username: user._id},{goal_money: goal_money});

        res.status(200).json({
            result: "Y",
            code: 200,
            message: "목표 금액 수정 성공"
        })
    } catch (error) {
        res.status(400).json({
            result: "N",
            code: 400,
            message: "목표 금액 수정 실패",
            error: error
        });
    }
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

export const getDetails = async (req, res) => {
    const { username } = req.decoded;
    const { year, month, day } = req.body;
    const date = year + "-" + month + "-" + day;

    try {
        const user = await User.findOne({username: username});
        const amount = await Amount.find()
        .where('regDate').equals(date)
        .where('username').equals(user._id)
        .select('content').select('category').select('type').select('money');

        res.status(200).json({
            result: "Y",
            code: 200,
            message: "Success",
            data: amount
        });
    } catch (error) {
        res.status(400).json({
            result: "N",
            code: 400,
            message: "fail",
            error: error
        })
    }

}

export const postDetails = async (req, res) => {
    const { username } = req.decoded;
    const { year, month, day, type, money, content, category } = req.body;
    const date = year + "-" + month + "-" + day;

    try {
        const user_name = await User.findOne({ username: username });
        await Amount.create({ regDate: date, type: type, money: money, content: content, category: category, username: user_name });

        res.status(200).json({
            result: "Y",
            code: 200,
            message: "특정 일 수입/지출 저장 완료"
        });
    } catch (error) {
        res.status(400).json({
            result: "N",
            code: 400,
            message: "특정 일 수입/지출 저장 실패",
            error: error
        })
    }
}

export const putDetails = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, day, _id, type, money, content, category } = req.body;
    const date = year + "-" + month + "-" + day;

    try {
        const user_name = await User.findOne({ username: username });
        await Amount.findOneAndUpdate({username:user_name._id, _id:_id},{ regDate: date, type: type, money: money, content: content, category: category, username: user_name });

        res.status(200).json({
            result: "Y",
            code: 200,
            message: "Success"
        });
    } catch (error) {
        res.status(400).json({
            result: "N",
            code: 400,
            message: "fail",
            error: error
        })
    }
}

export const deleteDetails = (req,res) => {
    const { username } = req.decoded;
    const { _id } = req.body;

    try {
        
    } catch (error) {
        
    }
}

export const badge = (req,res) => {
    res.send("badge");
}