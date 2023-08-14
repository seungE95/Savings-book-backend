import express from "express";
import userRouter from "../routers/userRouter.js";

const app = express();
const PORT = 3000;
const logger = morgan("dev");

app.use(logger);
app.use("/api/user", userRouter);

const handleListener = () => {
    console.log(`Hello! Savings Book start http://localhost:${PORT}`);
}

app.listen(PORT, handleListener);