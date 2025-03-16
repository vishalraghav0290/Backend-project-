import {asyncHandler} from "../utils/asyncHandler"
import {ApiError} from "../utils/ApiError"
import {User, Vedio} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


// to upload vedio we need to provide  first email and verify it and username too 
// we need tittle and descripotion and username from req.query 
// check if the vedio from same string does exist or not 


// upload it on clounirany or multter \
// save vedio string in database 



// to show all vedio

const showAllVedio = asyncHandler(async(req , res)=>{
    // to show all vedio we need vedioId 
    const showvedio= await Vedio.find({})

    return res.status(200).json(200 , showvedio , "vedio fecth succefully")

})


// to add new vedio 

const addVedio = asyncHandler(async(req  , res)=>{
    // we need and user and a vedio 

    const userId = req.query._id
    const {vedioId}= req.query

    const user = await User.findById(userId)
})


// to remove vedio