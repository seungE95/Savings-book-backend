import jwt from "jsonwebtoken";
require("dotenv").config();

const token = () => {
  return {
    access(username) {
      return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
    },
    refresh(username) {
      return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "180 days",
      });
    }
  }
}


exports.verifyToken = (req, res, next) => {
  //인증 완료
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    return next();
  }
  //인증 실패
  catch (error) {
    if (error.name === 'TokenExpireError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.'
    });
  }
}