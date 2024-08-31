import mongoose from "mongoose";

require("dotenv").config();
const MONGODB_DATABASE_URI: string = process.env.MONGODB_DATABASE_URI;
const MONGODB_NAME: string = process.env.MONGODB_NAME;

const dbConnect = async () => {
    try {
        await mongoose.connect(`${MONGODB_DATABASE_URI}/${MONGODB_NAME}`);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error occurred while connecting to database:");
        console.error(error);
        process.exit(1);
    }
}

export default dbConnect;