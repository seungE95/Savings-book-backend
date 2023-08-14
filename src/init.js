import express from "express";
import userRouter from "../routers/userRouter.js";

const app = express();
const PORT = 8000;

const handleListener = () => {
    console.log(`Hello! Savings Book start http://localhost:${PORT}`);
}

app.use("/api/user", userRouter);
app.listen(PORT, handleListener);