import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n Mongo db connected`)

    } catch (error) {
        throw error 
        console.log('MONOGO connection failed check for filre in db index')
        process.exit(1);        
    }
}

export default connectDB