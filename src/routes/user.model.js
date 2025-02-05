import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
         
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index: true,
       
    },
    avatar:{
        type: String, // here we gonna use cloundnary services
        required: true,
       
        
    },
    coverImage:{
        type: String,
        
    },
    wacthHistory:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vedio"
      }],
    password:{
        type: String,
        required: [true , 'password is required']

    },
    refreshToken:{
        type: String,
    }
      
    
    
    
    
    
    
}, {timestamps: true});


 export const User = mongoose.model("User" , userSchema);