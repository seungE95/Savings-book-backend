import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config("env");

mongoose.connect(process.env.DB_URL,{
    
}).then(()=>{
    console.log("\nConnected to DB 🎄");
}).catch((error)=>{
    console.error("\nDB Connected error::: " + error);
});

const db = mongoose.connection;

export default db;