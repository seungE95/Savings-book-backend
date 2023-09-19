import bcrypt from "bcrypt";
import User from "../models/user.js";
import Amount from "../models/amount.js";
import Goal from "../models/goal.js";
import Quiz from "../models/quiz.js";

//jwt 라이브러리
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config("../env");

export const login = async (req, res) => {
    const key = process.env.SECRET_KEY;
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    let token = "";
    
    if (!user) {
        return res.json({
            result: "N",
            code: 401,
            message: "Fail: 아이디가 일치하지 않습니다."
        })
    } else {
        const isEqualPw = await bcrypt.compare(password, user.password);
        
        if (isEqualPw) {
            //jwt.sign(payload, secretOrPrivateKey, [options, callback])
            token = jwt.sign(
                {
                    type: "JWT",
                    username: username,
                    nick_name: user.nick_name
                },
                key,
                {
                    expiresIn: "360m",   //15분후 만료
                    issuer: "토큰발급자",
                }
            );
            return res.json({
                result: "Y",
                code: 200,
                message: "token is created",
                authorization: token,
            });
        } else {
            return res.json({
                result: "N",
                code: 401,
                message: "Fail: 비밀번호가 일치하지 않습니다."
            });
        }
    }
}

export const signup = async (req, res) => {
    
    const { username, password, nick_name } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        User.create({ username, password: hashed, nick_name });

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        })
    } else {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail"
        });
    }
}

export const nickname = async (req, res) => {
    const username = req.decoded.username;
    const { nick_name } = req.body;
    
    try {
        const user = await User.findOneAndUpdate(
            { username },
            {$set: {nick_name: nick_name}}
        )

        return res.json({
            result: "Y",
            code: 200,
            message: "Success"
        });
    } catch (error){
        return res.json({
            result: "N",
            code: 400,
            message: "Fail",
        });
    }
    
}

export const userdata = async (req,res) => {
    const { username } = req.decoded;

    try {
        const user = await User.findOne({username:username})

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: {
                username: username,
                nick_name: user.nick_name
            }
        });
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail",
            error: error
        });
    }
    
}

export const deleteUser = async (req,res) => {
    const { username } = req.decoded;
    
    try {
        const user = await User.findOneAndDelete({username: username});
        console.log("\nuser._id:: "+user._id);
        await Amount.deleteOne({username: user._id});
        await Goal.deleteOne({username: user._id});

        return res.json({
            result: "Y",
            code: 200,
            message: "Success",
        })
    } catch (error) {
        return res.json({
            result: "N",
            code: 400,
            message: "Fail"
        })
    }
}

export const randomquiz = async (req,res) => {

    const num = Math.floor(Math.random() * 3) + 1;

    try {

        const quiz = await Quiz.findOne({num: num});
        console.log("\nquiz:: "+quiz.quiz);
        console.log("\nanswer:: "+quiz.answer);
        res.json({
            result: "Y",
            code: 200,
            message: "Success",
            data: {
                question: quiz.quiz,
                answer: quiz.answer
            }
        })
    } catch (error) {
        res.json({
            result: "N",
            code: 400,
            message: "Fail"
        })
    }
}

