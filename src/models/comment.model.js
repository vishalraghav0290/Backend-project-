import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    owner:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
    },
    vedio:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vedio"
    }
},{timestamps: true})

export const comment = mongoose.model("comment" , commentSchema)