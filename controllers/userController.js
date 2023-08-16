import bcrypt from "bcrypt";
import Member from "member.js";

export const login = async (req, res) => {
    const { username, password } = req.body;
    const member = Member.findOne({ username });

    if (!member) {
        return res.status(400).send({ errorMessage: "Bad Request" });
    }

    const validationCheck = await bcrypt.compare(password, member.password);

    if (!validationCheck) {
        return res.status(400).send({ errorMessage: "Bad Request" });
    }
    return res.redirect("/");
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