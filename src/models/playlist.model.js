import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: ture
    },
    videos:[
        {
            type: mongoose.Schema.Types.ObjectId,
             ref: "vedio"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, {timestamps: true})

export const playlist = mongoose.model("playlist" , playlistSchema)