import Amount from "../models/amount.js"
import User from "../models/user.js"
import Goal from "../models/goal.js"

//당월 총 수입/지출
export const monthTotal = async(req,res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;
    
    if(year == null || month == null){
        return res.json({
            result: "N",
            code: 400,
            message: "Fail: 날짜를 입력해주세요"
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
        //당월 총 지출금
        let out = 0;
        //당월 총 수입금
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
            message: "Fail"
        });
    }
};

//당월 목표 금액 조회
export const getGoal = async (req, res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;
    
    try {
        if (year != null && month != null) {
            const user = await User.findOne({username: username});            
            const goal = await Goal.findOne({username: user._id, regDate:date});
            
            //"YYYY-MM-DD"에서 year 값만 추출
            const resYear = goal.regDate.substring(0,4);
            //"YYYY-MM-DD"에서 month 값만 추출
            const resMonth = goal.regDate.substring(5,7);
            
            return res.json({
                result: "Y",
                code: 200,
                message: "Success",
                data: {
                    date:{
                        year: resYear,
                        month: resMonth
                    },
                    goal_money: goal.goal_money
                }
            });
        }
    } catch (error) { 
        return res.json({
            result: "N",
            code: 400,
            message: "Fail: 해당 날짜에 목표 금액이 없음",
        });
    }
}

//당월 목표 금액 작성
export const postGoal = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, goal_money } = req.body;
    const date = year + "-" + month;
    
    try{
        const user_name = await User.findOne({username: username});
        await Goal.create({regDate: date, goal_money: goal_money, username: user_name});
        

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail",
            error: error
        });
    }
}

//당월 목표 금액 수정
export const putGoal = async (req,res) => {
    const { username } = req.decoded;
    const { year, month, goal_money } = req.body;
    const date = year + "-" + month;
    
    try{
        const user = await User.findOne({username: username});
        await Goal.findOneAndUpdate({regDate: date,username: user._id},{goal_money: goal_money});

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail",
            error: error
        });
    }
}

//카테고리 별 지출 퍼센트
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
        
        //total: 백분율 구할때 필요, 나머지는 카테고리 변수들
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
            message: "Fail"
        })
    }

}

//전월/당월 일별 지출 리스트(라인그래프)
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
        const thisMonth = await Amount
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

        //이번달 마지막날 추출 ex)29일, 30일, 31일
        let thisDate = new Date(year, month, 0).getDate();
        //이번달 일별 총 지출금 배열에 담기
        let thisArr =[];
        let k = 1;

        for(let i=0; i < thisDate; i++){
            for(k; k <= thisDate; k++){
                try {
                    //k 1부터 마지막날 까지 증가, 지출이 있는날 배열에 금액 push
                    if(k == parseInt(thisMonth[i].date.substring(8,10))){
                        thisArr.push(thisMonth[i].money);
                        break;
                    } else {
                        //지출이 없는날은 0 값을 push
                        thisArr.push(0);
                    }
                } catch (error) {
                    //thisMonth에 저장된 금액이 더 없을 경우 나머지 값을 0으로 채움
                    thisArr.push(0);
                }
            }
            //날짜 초기값을 증가 시켜서 지난일 부터 반복하지 않도록함
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
        //지난달 일별 총 지출금 배열에 담기
        let lastArr =[];
        let j = 1;
        for(let i=0; i<lastDay; i++){
            for(j; j<=lastDay; j++){
                try {
                    //j 1부터 마지막날 까지 증가, 지출이 있는날 배열에 금액 push
                    if(j == parseInt(lastMonth[i].date.substring(8,10))){
                        lastArr.push(lastMonth[i].money);
                        break;
                    } else {
                        //지출이 없는날은 0 값을 push
                        lastArr.push(0);
                    }
                } catch (error) {
                    //lastMonth에 저장된 금액이 더 없을 경우 나머지 값을 0으로 채움
                    lastArr.push(0);
                }
            }
            //날짜 초기값을 증가 시켜서 지난일 부터 반복하지 않도록함
            j ++;
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: [
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
            message: "Fail"
        });
    }
}

//당월 일별 총 수입/지출 리스트(캘린더)
export const calendar = async (req,res) => {
    const { username } = req.decoded;
    const { year, month } = req.query;
    const date = year + "-" + month;

    try {
        const user = await User.findOne({ username:username });

        const daily = await Amount.find()
        .select('money regDate type')
        .where('username').equals(user._id)
        .where('regDate').equals({$regex:date})
        .sort('regDate');

        // 빈 객체를 생성하여 거래를 그룹화하고 합산합니다.
        const groupedTransactions = {};

        for (const transaction of daily) {
            const key = `${transaction.regDate}-${transaction.type}`;
        if (groupedTransactions[key]) {
            // 이미 같은 날짜와 타입의 거래가 있는 경우, 금액을 합산합니다.
            groupedTransactions[key].money += parseInt(transaction.money, 10);
        } else {
            // 새로운 거래를 추가합니다.
            groupedTransactions[key] = {
            date: transaction.regDate,
            type: transaction.type,
            money: parseInt(transaction.money, 10),
            };
        }
        }

        // 결과를 객체 배열로 변환합니다.
        const result = Object.values(groupedTransactions);

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: result
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail"
        })
    }
}

//당월 특정 일 수입/지출 상세보기
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
            message: "Fail"
        })
    }

}

//당월 특정 일 수입/지출 작성
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
            message: "Success"
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail",
            error: error
        })
    }
}

//당월 특정 일 수입/지출 수정
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
            message: "fail"
        })
    }
}

//당월 특정 일 수입/지출 삭제
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
                message: "Fail: 일치하는 정보가 데이터가 없습니다"
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
            message: "fail"
        })
    }
}


/*
    ======보류=======
*/
// export const badge = (req,res) => {
//     res.send("badge");
// }