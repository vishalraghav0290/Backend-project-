import mongoose from "mongoose";
 
const vedioSchema = new mongoose.Schema({},{timestamps: true})


export const Vedio = mongoose.model("Vedio" , vedioSchema)