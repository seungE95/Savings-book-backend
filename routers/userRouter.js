import express from "express";
import { login, signup, nickname, userdata } from "../controllers/userController.js";
import { auth } from "../authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.patch("/nickname", auth, nickname);
userRouter.get("/userdata", auth, userdata);

export default userRouter;