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

    //let sysMonth = new Date(year,month,0);
    //console.log("\nsysMonth:: "+ sysMonth.slice(1,2));

    let intMonth = parseInt(month);
    let intYear = parseInt(year);
    //지난달 구하기
    if(intMonth-1 > 0){
        intMonth = "0" + String(intMonth - 1);
    } else{
        intYear = intYear - 1; 
        intMonth = "12";
    }

    const lastDate = String(intYear) + "-" + String(intMonth);

    try {
        const user = await User.findOne({ username:username });
        const thisMonth = await Amount.find()
        .where('username').equals(user._id)
        .where('regDate').equals({$regex:date})
        .where('type').equals('out')
        .select('money')
        .select('regDate')
        .sort('regDate');

        const lastMonth = await Amount.find()
        .where('username').equals(user._id)
        .where('regDate').equals({$regex:lastDate})
        .where('type').equals('out')
        .select('money')
        .select('regDate')
        .sort('regDate');

        if(lastMonth == null) throw error;

        // const money = [];
        // const day = []; 
        // const count = Object.keys(thisMonth);
        // let plus = 0;

        // console.log("\n:::여기부터::: ");
        // for(let i=0; i < count.length; i++){
        //     if(i != count.length){
        //         if( thisMonth[i].regDate == thisMonth[i+1].regDate){
        //             plus += thisMonth[i].money;
        //             console.log("\n1")
        //         } else if( thisMonth[i].regDate != thisMonth[i+1].regDate){
        //             if(plus != 0){
        //                 money.push(plus);
        //                 day.push(thisMonth[i].regDate.substring(8,10));
        //                 plus = 0;
        //                 console.log("\n2")
        //             }else{
        //                 money.push(thisMonth[i].money);
        //                 day.push(thisMonth[i].regDate.substring(8,10));
        //                 console.log("\n3")
        //             }
        //         }
        //     }else if(thisMonth[i-1].regDate == thisMonth[i].regDate){
        //         console.log("\n:::4::: ");
        //         plus += thisMonth[i].money;
        //         money.push(plus);
        //         day.push(thisMonth[i].regDate.substring(8,10));
        //     }else{
        //         money.push(thisMonth[i].money);
        //         day.push(thisMonth[i].regDate.substring(8,10));
        //     }
        // }

        

        const groupedData = thisMonth.reduce((acc, current) =>{
            const key = `${current.regDate.substring(8,10)}-${current.type}`;
            
            if(!acc[key]){
                acc[key] = {
                    // date: current.regDate,
                    // type: current.type,
                    day: current.regDate.substring(8,10),
                    money: 0
                };
            }
            acc[key].money += current.money;

            return acc;
        }, {});
        

        const result = Object.values(groupedData.slice(1));
        
        console.log("\nresult::: "+ result);

        const lastMoney = [];
        const lastCount = Object.keys(lastMonth);

        for(let i=0; i < lastCount.length; i++){
            lastMoney.push(lastMonth[i].money);
        }

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: [{
                date: {
                    year: intYear,
                    month: intMonth
                },
                money: lastMoney
            },{
                date: {
                    year: year,
                    month: month
                },
                day: [groupedData.day],
                money: [groupedData.money]
            }]
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
        const daily = await Amount.find()
        .where('username').equals(user._id)
        .where('regDate').equals({$regex:date})
        .select('type')
        .select('money')
        .select('regDate')
        .sort('regDate');
        
        const groupedData = daily.reduce((acc, current) =>{
            const key = `${current.regDate}-${current.type}`;
            //if(current.money){
            if(!acc[key]){
                acc[key] = {
                    date: current.regDate,
                    type: current.type,
                    money: 0
                };
            }
            acc[key].money += current.money;

            return acc;
        }, {});

        const result = Object.values(groupedData);

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