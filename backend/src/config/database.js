import mongoose from "mongoose"
import config from "./config.js";

async function connectDB(){
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;