import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config("env");

mongoose.connect(process.env.DB_URL,{
    
}).then(()=>{
    console.log("\n Connected to DB 🎄");
}).catch((error)=>{
    console.error("\n DB Connected error::: " + error);
});

const db = mongoose.connection;

export default db;