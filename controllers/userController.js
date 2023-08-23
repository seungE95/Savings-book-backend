import bcrypt from "bcrypt";
import User from "../models/user.js";
//jwt 라이브러리
import jwt from "jsonwebtoken";
//토큰 유효성 검사 미들웨어
//import { auth } from "../authMiddleware.js"
import dotenv from "dotenv";
dotenv.config("../env");

export const login = async (req, res) => {
    const key = process.env.SECRET_KEY;
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    let token = "";
    
    if (!user) {
        return res.status(401).json({
            result: "N",
            code: 401,
            message: "아이디가 일치하지 않습니다."
        })
    } else {
        const isEqualPw = await bcrypt.compare(password, user.password);
        
        if (isEqualPw) {
            //jwt.sign(payload, secretOrPrivateKey, [options, callback])
            token = jwt.sign(
                {
                    type: "JWT",
                    username: username,
                    nickname: user.nick_name
                },
                key,
                {
                    expiresIn: "15m",   //15분후 만료
                    issuer: "토큰발급자",
                }
            );
            //response
            return res.status(200).json({
                result: "Y",
                code: 200,
                message: "token is created",
                access_token: token,
                data: {
                    nickname: user.nick_name
                }
            });
        } else {
            return res.status(401).json({
                result: "N",
                code: 401,
                message: "비밀번호가 일치하지 않습니다."
            });
        }
    }
}
export const signup = async (req,res) => {
    const { username, password, nick_name } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        User.create({ username, password: hashed, nick_name });

        return res.status(200).json({
            result: "Y",
            code: 200,
            message: "회원가입 성공"
        })
    } else {
        return res.status(400).json({
            result: "N",
            code: 400,
            message: "이미 아이디가 존재합니다."
        });
    }
}

export const nickname = (req, res) => {
    const username = req.decoded.username;
    const nickname = req.decoded.nickname;
    const { nick_name } = req.body;

    const user = User.findByIdAndUpdate(nickname)
    return res.send("닉네임 수정");
}

export const userdata = (req,res) => {
    return res.send("유저정보");
}

export const home = (req,res) => {
    return res.send("배포 완료");
}