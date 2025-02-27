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
likeSchema.index({ likedBy: 1, video: 1 }, { unique: true });
likeSchema.index({ likedBy: 1, comment: 1 }, { unique: true });
likeSchema.index({ likedBy: 1, tweet: 1 }, { unique: true });

export const like = mongoose.model("like" ,likeSchema )