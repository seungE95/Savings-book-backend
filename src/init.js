import express from "express";
import userRouter from "../routers/userRouter.js";
import mainRouter from "../routers/mainRouter.js"
import morgan from "morgan";
import db from "../db.js";
import cors from "cors";

const app = express();
const PORT = 3000;
const logger = morgan("dev");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);
//app.use("/", userRouter);
app.use("/api/user", userRouter);
app.use("/api/main", mainRouter);

const handleListener = () => {
    console.log(`Hello! Savings Book start`);
}

app.listen(PORT, handleListener);