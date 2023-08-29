import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config("env");

mongoose.set('debug', true);

mongoose.connect(process.env.DB_URL,{
    dbname: 'savingsbook',
    useNewUrlParser: true
}).then(()=>{
    console.log("\nConnected to DB 🎄"+process.env.DB_URL);
}).catch((error)=>{
    console.error("\nDB Connected error::: " + error);
});

const db = mongoose.connection;

export default db;