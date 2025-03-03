import { subscription } from "../models/Subscription.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


// in subscription controller we need to do:


// add a channel to subcsrciption
const addSubChannel = asyncHandler(async(req , res)=>{
   // to add channel in sub we need to user id and channel name 

   // issuse to deal with subs channel is also a user and user is user only
   const userId = req.user._id
   const {curruserId} = req.query

   const user  = await User.findById(userId)
   const curruser  = await User.findById(curruserId)

   if(!user){
    throw new ApiError(400 , "user not found error controller/susbscription line 24")
   }
   if(!curruser){
    throw new ApiError(400 , "current user is not found controllers/susnvription line 27")
   }

   const subobj=await subscription.create(
   { subscription: curruserId,
    channel: userId
    }
   )
   return res.status(200).json(new ApiResponse(200 , subobj , "successfully subscripided channels"))


})

// show all channel a user has subscribled to 

const showAll = asyncHandler(async(req , res)=>{
    const userId = req.user._id
    const {curruserId} = req.query

    const curruser = await User.findById(userId)
    if(!curruser){
        throw new ApiError(400 , "current is not found error in line 48 frm subs.js")
    }
    if(userId){
    const usersubscribed  = await User.find({
        subscription: curruserId
    }).populate('channel')
    return usersubscribed
}
return res.status(200).status(new ApiResponse(200 , usersubscribed , "fecth user subscribed channels"))
})


// remove a channel from subscription 

const removechannel = asyncHandler(async(req , res)=>{
    // to remove channel from subscription we need channel id 

    const {currentUserId} = req.query  
    

   await deleteOne();

   return res.status(200).json(new ApiResponse(200 , null , "channel removed succesfull"))


})

export{removechannel , showAll , addSubChannel}

