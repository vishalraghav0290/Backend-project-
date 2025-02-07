import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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

userSchema.pre("save" , async function(err, req, res , next){
    if(!this.isModified('password')) return next();
    this.password=bcrypt.hash(this.password, 10)
    next();
    
})
userSchema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id: this._id,
        email: this._email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id: this._id,
        email: this._email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

 export const User = mongoose.model("User" , userSchema);