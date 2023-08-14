
export const login = (req, res) => {
    const { username, password } = req.body;
    return res.send("로그인 페이지");
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