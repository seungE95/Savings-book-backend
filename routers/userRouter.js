import express from "express";
import { login, signup, nickname, userdata, home } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.get("/", home);
userRouter.get("/sigup", signup);
userRouter.get("/nickname", nickname);
userRouter.get("/userdata", userdata);

export default userRouter;