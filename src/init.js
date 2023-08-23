import express from "express";
import userRouter from "../routers/userRouter.js";
import morgan from "morgan";
import db from "../db.js";
import cors from "cors";

const app = express();
const PORT = 3000;
const logger = morgan("dev");

app.use(cors(corsConfig));
app.use(express.urlencoded({extended: true}));
app.use(logger);
app.use("/", userRouter);
app.use("/api/user", userRouter);

const corsConfig = {
    origin: "https://port-0-savings-book-backend-eu1k2llladze0x.sel3.cloudtype.app/",
    credentials: true,
};

const handleListener = () => {
    console.log(`Hello! Savings Book start http://localhost:${PORT}`);
}

app.listen(PORT, handleListener);