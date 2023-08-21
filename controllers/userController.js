//import bcrypt from "bcrypt";
import Member from "../models/member.js";
//jwt 라이브러리
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config("../env");

export const login = (req, res, next) => {
    const {username, password} = req.body;
    const key = process.env.SECRET_KEY;
    console.log("\n username: " + username + "\n password: " + password);
    const username1 = "id";
    const password1 = "123123";

    let token = "";

    try{
        if(username == username1 && password == password1){
            //jwt.sign(payload, secretOrPrivateKey, [options, callback])
            token = jwt.sign(
                {
                    type: "JWT",
                    nickname: nickname,
                    profile: profile
                },
                key,
                {
                    expiresIn: "15m",   //15분후 만료
                    issuer: "토큰발급자",
                }
            );
            //response
            return res.status(200).json({
                code:200,
                message: "token is created",
                token: token,
            });
        }
    } catch(error){
        return res.status(401).json({
            code:401,
            message: "로그인 정보가 잘 못 되었습니다.",
            error: error
        });
    }

    
    

    // const { username, password } = req.body;
    // const member = Member.findOne({ username });

    // if (!member) {
    //     return res.status(400).send({ errorMessage: "Bad Request" });
    // }

    // const validationCheck = await bcrypt.compare(password, member.password);

    // if (!validationCheck) {
    //     return res.status(400).send({ errorMessage: "Bad Request" });
    // }
    // return res.redirect("/");
}

export const signup = (req,res) => {
    return res.send("회원가입");
}

export const nickname = (req,res) => {
    return res.send("닉네임 수정");
}

export const userdata = (req,res) => {
    return res.send("유저정보");
}

export const home = (req,res) => {
    return res.send("home");
}