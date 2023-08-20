import express from "express";
import userRouter from "../routers/userRouter.js";
import morgan from "morgan";

const app = express();
const PORT = 3000;
const logger = morgan("dev");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger);
app.use("/", userRouter);
app.use("/api/user", userRouter);

const handleListener = () => {
    console.log(`Hello! Savings Book start http://localhost:${PORT}`);
}

app.listen(PORT, handleListener);