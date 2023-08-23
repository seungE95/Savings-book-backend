import bcrypt from "bcrypt";
import User from "../models/user.js";
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
        return res.status(401).json({
            code: 401,
            message: "아이디가 일치하지 않습니다."
        })
    } else {
        const isEqualPw = await bcrypt.compare(password, user.password);
        
        if (isEqualPw) {
            //jwt.sign(payload, secretOrPrivateKey, [options, callback])
            token = jwt.sign(
                {
                    type: "JWT"
                },
                key,
                {
                    expiresIn: "15m",   //15분후 만료
                    issuer: "토큰발급자",
                }
            );
            //response
            return res.status(200).json({
                code: 200,
                message: "token is created",
                token: token,
                data: {
                    nick_name: user.nick_name
                }
            });
        } else {
            return res.status(401).json({
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
            code: 200,
            message: "회원가입 성공"
        })
    } else {
        return res.status(400).json({
            code: 400,
            message: "이미 같은 아이디가 존재합니다."
        });
    }
}

export const nickname = (req,res) => {
    return res.send("닉네임 수정");
}

export const userdata = (req,res) => {
    return res.send("유저정보");
}

export const home = (req,res) => {
    return res.send("배포 완료");
}