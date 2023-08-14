import express from "express";
import { login,signup, nickname, userdata } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/login", login);
userRouter.get("/sigup", signup);
userRouter.get("/nickname", nickname);
userRouter.get("/userdata", userdata);

export default userRouter;