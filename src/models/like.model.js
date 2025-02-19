import mongoose from "mongoose"

const likeSchema = new mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    vedio:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Vedio"
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "tweet"
    }
} , {timestamps: true})

export const like = mongoose.model("likeSchema" ,likeSchema )