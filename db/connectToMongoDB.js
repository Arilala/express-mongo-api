import mongoose from "mongoose";
import logger from "../logger/logger.js"
import ora from 'ora';
const connectToMongoDB = async ()=>{
    try {
        const spinner = ora('Connected to MongoDB .....').start();
        await mongoose.connect(process.env.MONGO_DB_URL);
        spinner.stop();
    } catch (error) {
        logger.error(`Error connecting to MongoDB ${error.message}`)
        spinner.stop();
    }
}

export default connectToMongoDB;