import express from "express";
import { login, signup, nickname, userdata, home } from "../controllers/userController.js";
import { auth } from "../authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", home);
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.patch("/nickname", nickname);
//userRouter.patch("/nickname", auth, nickname);
userRouter.get("/userdata", userdata);

export default userRouter;