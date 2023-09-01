import express from "express";
import userRouter from "../routers/userRouter.js";
import mainRouter from "../routers/mainRouter.js"
import morgan from "morgan";
import db from "../db.js";
import cors from "cors";

const app = express();
const PORT = 3000;
const logger = morgan("dev");

const corsConfig = {
    origin: "https://port-0-savings-book-backend-eu1k2llladze0x.sel3.cloudtype.app/",
    credentials: true,
};

app.use(cors(corsConfig));
// app.use((req, res) => {
//     res.header("Access-Control-Allow-Origin", "https://port-0-savings-book-backend-eu1k2llladze0x.sel3.cloudtype.app/");
// });
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/", userRouter);
app.use("/api/user", userRouter);
app.use("/api/main", mainRouter);

const handleListener = () => {
    console.log(`Hello! Savings Book start http://localhost:${PORT}`);
}

app.listen(PORT, handleListener);