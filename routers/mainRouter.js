import express from "express";
import { 
    monthTotal,
    getGoal,
    postGoal,
    putGoal,
    category,
    dailylist,
    calendar,
    getDetails,
    postDetails,
    putDetails,
    badge
} from "../controllers/mainController.js";
import { auth } from "../authMiddleware.js";    //token 유효성 검증

const mainRouter = express.Router();

mainRouter.get("/monthtotal", auth, monthTotal);
mainRouter.route("/goal").get(getGoal).post(postGoal).put(putGoal);
mainRouter.get("/category", category);
mainRouter.get("/dailylist", dailylist);
mainRouter.get("/calendar", calendar);
mainRouter.route("/details").get(getDetails).post(postDetails).put(putDetails);
mainRouter.get("badge", badge);