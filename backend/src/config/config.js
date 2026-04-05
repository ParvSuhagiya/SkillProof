import dotenv from "dotenv"

dotenv.config();

if(!process.env.MONGO_URI || !process.env.JWT_SECRET){
    console.error("Missing required environment variables. Please check your .env file.");
    process.exit(1);
}

if(!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN || !process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_USER){
    console.warn("Google OAuth environment variables are not fully set. Google login will not work.");
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_ACCESS_TOKEN: process.env.GOOGLE_ACCESS_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER
}

export default config;