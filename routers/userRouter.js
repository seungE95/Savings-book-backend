import express from "express";
import { login, signup, nickname, userdata, deleteUser, badge, randomquiz } from "../controllers/userController.js";
import { auth } from "../authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.patch("/nickname", auth, nickname);
userRouter.get("/userdata", auth, userdata);
userRouter.delete("/deleteuser", auth, deleteUser);
userRouter.get("/randomquiz", randomquiz);
userRouter.get("/badge", auth, badge);

export default userRouter;