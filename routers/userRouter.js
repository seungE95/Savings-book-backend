import express from "express";
import { login, signup, nickname, userdata, home } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", home);
userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/nickname", nickname);
userRouter.get("/userdata", userdata);

export default userRouter;