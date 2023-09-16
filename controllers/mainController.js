import Amount from "../models/amount.js"
import User from "../models/user.js"

export const monthTotal = async(req,res) => {
    const {username} = req.decoded;
    const {year, month} = req.query;
    const date = year + "-" + month;
    
    if(year == null || month == null){
        return res.json({
            result: "N",
            code: 400,
            message: "날짜를 입력해주세요"
        })
    }
    try {
        const user = await User.findOne({username: username})
        const amount = await Amount.find()
        .where('regDate').equals({$regex:date})
        .where('username').equals(user._id)
        .select('money')
        .select('type');

        const count = Object.keys(amount);
        let out = 0;
        let income = 0;

        for(let i=0; i<count.length; i++){
            if('out' == amount[i].type){
                out += amount[i].money;
            } else if('in' == amount[i].type){
                income += amount[i].money;
            }
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: {
                date: {
                    year: year,
                    month: month
                },
                list:{
                    in : income,
                    out : out
                }
            }
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "fail"
        });
    }
};

export const getGoal = async (req, res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;
    console.log("ndate::: "+ date)
    try {
        if (year != null && month != null) {
            const user = await User.findOne({username: username});            
            const amount = await Amount.findOne({username: user._id, regDate:date});
            
            const resYear = amount.regDate.substring(0,4);
            const resMonth = amount.regDate.substring(5,7);
            
            return res.json({
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
        return res.json({
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
        await Amount.create({regDate: date, goal_money: goal_money, username: user_name});
        

        return res.json({
            result: "Y",
            code: 200,
            message: "목표 금액 생성 성공"
        })
    } catch (error) {
        return res.json({
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

        return res.json({
            result: "Y",
            code: 200,
            message: "목표 금액 수정 성공"
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "목표 금액 수정 실패",
            error: error
        });
    }
}

export const category = async (req,res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;

    try {
        const user = await User.findOne({ username:username });
        const category = await Amount.find()
        .where('username').equals(user._id)
        .where('regDate').equals({$regex:date})
        .where('type').equals('out')
        .select('category')
        .select('money');

        const count = Object.keys(category)
        
        let total = 0, eat = 0, cafe = 0, pleasure = 0, shopping = 0, etc = 0;

        for(let i=0; i<count.length; i++){

            switch(category[i].category){
                case 'eat':
                    eat += category[i].money;
                    break;
                case 'cafe':
                    cafe += category[i].money;
                    break;
                case 'pleasure':
                    pleasure += category[i].money;
                    break;
                case 'shopping':
                    shopping += category[i].money;
                    break;
                case 'etc':
                    etc += category[i].money;
                    break;
            }
        }

        //백분율 구하기
        total = eat + cafe + pleasure + shopping + etc;

        if(eat != 0)
            eat = Math.round((eat/total) * 100).toFixed(1);
        if(cafe != 0)
            cafe = Math.round((cafe/total) * 100).toFixed(1);
        if(pleasure != 0)
            pleasure = Math.round((pleasure/total) * 100).toFixed(1);
        if(shopping != 0)
            shopping = Math.round((shopping/total) * 100).toFixed(1);
        if(etc != 0)
            etc = Math.round((etc/total) * 100).toFixed(1);
        
        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: {
                date: {
                    year: year,
                    month: month
                },
                category: {
                    eat: eat,
                    cafe: cafe,
                    pleasure: pleasure,
                    shopping: shopping,
                    etc: etc
                }
            }
        })
    } catch {
        return res.json({
            result: "N",
            code: 400,
            message: "fail"
        })
    }

}

export const dailylist = async (req,res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;

    let intMonth = parseInt(month);
    let intYear = parseInt(year);
    //지난달 구하기
    if(intMonth-1 > 0){
        intMonth = "0" + String(intMonth - 1);
    } else{
        intYear = intYear - 1; 
        intMonth = "12";
    }

    try {
        const user = await User.findOne({ username:username });
        const thisMonth = await Amount//.find()
        .aggregate([
            {
                $match: {
                    username: user._id,
                    regDate: {
                        $regex:date
                    },
                    type: 'out'
                }
            },
            {
                $group: {
                    _id: '$regDate',
                    date: { $first: '$regDate' },
                    money:{
                        $sum: '$money'
                    }
                }
            },
            {
                $sort: { date: 1 }
            },
            {
                $project: { _id: 0 }
            }
        ]);

        let thisDate = new Date(year, month, 0).getDate();
        
        let thisArr =[];
        // for(let i=0; i<thisDate; i++){
        //     try {
        //         if(i+1 == parseInt(thisMonth[i].date.substring(8,10))){
        //             thisArr.push(thisMonth[i].money);
        //         } 
        //     } catch {
        //         thisArr.push(0);
        //     }
        // }

        let k = 1;
        for(let i=0; i < thisDate; i++){
            for(k; k <= thisDate; k++){
                try {
                    if(k == parseInt(thisMonth[i].date.substring(8,10))){
                        thisArr.push(thisMonth[i].money);
                        break;
                    } else {
                        thisArr.push(0);
                    }
                } catch (error) {
                    thisArr.push(0);
                }
            }
            k ++;
        }

        //지날달 구하기
        const lastDate = String(intYear) + "-" + String(intMonth);
        
        const lastMonth = await Amount
        .aggregate([
            {
                $match: {
                    username: user._id,
                    regDate: {
                        $regex:lastDate
                    },
                    type: 'out'
                }
            },
            {
                $group: {
                    _id: '$regDate',
                    date: { $first: '$regDate' },
                    money:{
                        $sum: '$money'
                    }
                }
            },
            {
                $sort: { date: 1 }
            },
            {
                $project: { _id: 0 }
            }
        ]);

        //지난달 마지막day 얻기
        let lastDay = new Date(year, month-1, 0).getDate();

        let lastArr =[];
        let j = 1;
        for(let i=0; i<lastDay; i++){
            for(j; j<=lastDay; j++){
                try {
                    if(j == parseInt(lastMonth[i].date.substring(8,10))){
                        lastArr.push(lastMonth[i].money);
                        break;
                    } else {
                        lastArr.push(0);
                    }
                } catch (error) {
                    lastArr.push(0);
                }
            }
            j ++;
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            series: [
                {
                    name: "last_month",
                    data: lastArr
                },
                {
                    name: "this_month",
                    data: thisArr
                }
            ]
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "fail"
        });
    }
}

export const calendar = async (req,res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;

    try {
        const user = await User.findOne({ username:username });

        const daily = await Amount
        .aggregate([
            {
                $match: {
                    username: user._id,
                    regDate: {
                        $regex:date
                    },
                    type: {
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: ['$regDate', '$type'],
                    date: { $max: '$regDate' },
                    type: { $max: '$type' },
                    money:{
                        $sum: '$money'
                    }
                }
            },
            {
                $sort: { date : 1 }
            },
            {
                $project: { _id: 0 }
            }
        ]);


        let count = Object.keys(daily);
        for(let i=0; i< count.length; i++){
            console.log("\ndaily:: " + JSON.stringify(daily[i]))
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: daily
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "fail",
            error: error
        })
    }
}

export const getDetails = async (req, res) => {
    const { username } = req.decoded;
    const { year, month, day } = req.query;
    const date = year + "-" + month + "-" + day;

    try {
        const user = await User.findOne({username: username});
        const amount = await Amount.find()
        .where('regDate').equals(date)
        .where('username').equals(user._id)
        .select('content').select('category').select('type').select('money');

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: amount
        });
    } catch (error) {
        return res.json({
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

        return res.json({
            result: "Y",
            code: 200,
            message: "특정 일 수입/지출 저장 완료"
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "특정 일 수입/지출 저장 실패",
            error: error
        })
    }
}

export const putDetails = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, day, amount_nm, type, money, content, category } = req.body;
    const date = year + "-" + month + "-" + day;

    try {
        const user_name = await User.findOne({ username: username });
        await Amount.findOneAndUpdate({username:user_name._id, _id:amount_nm},{ regDate: date, type: type, money: money, content: content, category: category, username: user_name });

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "fail",
            error: error
        })
    }
}

export const deleteDetails = async (req,res) => {
    const { username } = req.decoded;
    const { amount_nm } = req.query;
    try {
        const user = await User.findOne({username:username});
        const amount = await Amount.deleteOne({_id:amount_nm})
        .where('username').equals(user._id);

        if(amount == null){
            return res.json({
                result: "N",
                code: 400,
                message: "일치하는 정보가 데이터가 없습니다"
            })
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "fail",
            error: error
        })
    }
}


/*
    ======보류=======
*/
// export const badge = (req,res) => {
//     res.send("badge");
// }