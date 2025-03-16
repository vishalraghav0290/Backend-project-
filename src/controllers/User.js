import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessTokenandRefreshToken = async(userId)=>{
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAcessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
     await  user.save({ validateBeforeSave: false})
     // here we sending these two as a wrap in object and when we call it need to distractor just holding value in array when called 
     return { accessToken , refreshToken}
   } catch (error) {
      throw new ApiError(500, "something went wrong while generating wrong ")
   }
}


// to register user
const registerUser = asyncHandler(async (req, res) => {
    // Get user details from request body
    const {fullname, email, username, password} = req.body

    // Validation - check if any required field is empty
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if user already exists with same email or username
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Add this debug log
    console.log("Files received:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("Avatar path:", avatarLocalPath);


    // here had to write code for check coverimage is undeifined or not tell 
    // Get local path of uploaded files
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    // Validate avatar upload
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // Upload files to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // Verify avatar upload success
    if (!avatar) {
        throw new ApiError(400, "Avatar file upload failed")
    }

    // Create user in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Get created user without sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Verify user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    // Return success response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

// to login user 
 const login = async (req , res)=>{
   const { username ,email  , password} = req.body

   if(!username || ! email ){
      throw new ApiError(400, "plz provide username or email ")
   }

   const user = await User.findOne({
      $or:[{username , email}]
   })
   if(!user){throw new ApiError(400 , "the username or email is not registered ")}

   const isPasswordCorrect = await user.isPasswordcorrect(password);

   if(!isPasswordCorrect){throw new ApiError(401 , "enter a valid password")}
   

 const {accessToken , refreshToken}=  await generateAccessTokenandRefreshToken(user._id)

 const loggedInUser = await user.findById(user._id).select("-password  -refreshToken")
 const options ={
   httpOnly: true,
   secure: true
 }
 return res.status(200).cookie("accessToken" , accessToken , options)
 .cookie("refreshToken" , refreshToken , options)
 .json(
   new ApiResponse(200, {
      user: loggedInUser , accessToken, refreshToken 
   }, "user loggeed in successfully ")
 )
 }
 // logout user 
 const logoutUser = asyncHandler(async(req, res)=>{
    await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true // this is to get new response in return if not do so then the return value come across
        }
    )
    const options ={
        httpOnly: true,
        secure: true
      }
      return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken" , options).json(new ApiResponse(200 , {} , "user logged out "))
 })

 const refreshAcessToken = asyncHandler(async(req , res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    

    if(!incomingRefreshToken){throw new ApiError(401 ," unauthorized request")}

try {
        const decodedToken= jwt.verify(
            incomingRefreshToken,
            process.env.Access_Token_Secert
        )
        const user =await User.findById(decodedToken?._id)
    
        if(!user){throw new ApiError(401 ," Invalid refresh Token")}
    
        if(incomingRefreshToken !== user?.refreshToken){throw new ApiError(401 ,"Refresh token is expired or used ")}
    
     const options ={
        httpOnly: true, 
        secure: true
     }
     const {accessToken , newrefreshToken}= await generateAccessTokenandRefreshToken(user._id)
    
      return res.status(200).Cookie("accessToken" , accessToken  , options).Cookie("refreshToken" , newrefreshToken , options).json(new ApiResponse(200 , {accessToken , newrefreshToken}))
} catch (error) {
    throw new ApiError(401 , error?.message || "Invalid refresh token")
}
})

const changeCurrentPassword = asyncHandler(async(req , res)=>{
    const {oldPassword , newPassword}= req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    

    if(!isPasswordCorrect){
        throw new ApiError(400 , "Invalid old password")
    }
    // to set new value is simple we had to use . opertor to use value and assign operator to allot value 
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200 , {} , "password changed succesfully"))

})
    const getCurrentUser = asyncHandler(async(req , res)=>{
        return res.status(200).json(200 , req.user , "current user fetched successfully")
    })

    const updateAccountDetails = asyncHandler(async(req, res)=>{
        const { fullName , email} = req.body

        if(!fullName || !email){throw new ApiError(400 , "all fields are required")}

        const user = User.findByIdAndUpdate(req.user?._id,
            {
                $set: {
                    fullName,
                    email
                }
            },
            {
                new : true // this return value after making it an update 
            }
        ).select("-password")

        return res.status(200).json(new ApiResponse(200 , user , "account details upload successfully" ))
    })


    // to change in file and 

    const updateUserAvatar = asyncHandler(async(req , res)=>{
        const avatarLocalPath=req.file?.path

        if(!avatarLocalPath){
            throw new ApiError(400 , "avatar not found or not uploadded")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatarLocalPath){
            throw new ApiError(400 , "Error while uploading on avatar")
        }
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            {
                new : true
            }
        ).select("-password")
    })  
    // to update coverImage
    const updatecoverImage = asyncHandler(async(req , res)=>{
        const coverImageLocalPath=req.file?.path

        if(!coverImageLocalPath){
            throw new ApiError(400 , "coverImage not found or not uploadded")
        }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if(!coverImageLocalPath){
            throw new ApiError(400 , "Error while uploading on coverImage")
        }
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage: coverImageLocalPath.url
                }
            },
            {
                new : true
            }
        ).select("-password")
    })
    const getUserChannelProfile = asyncHandler(async(req , res) =>{
           const {username}= req.params

           if(!username?.trim()){
            throw new ApiError(400 , "username is missing")
           }
    const channel=await User.aggregate([
            {
                $match:{
                    username: username?.lowercase()
                }
              
            },// here we count how much subscriber does it have through channel
            {
                $lookup:{
                    from:"subsscription",
                    localField:"_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },// here we count how much channel does current user subscribered to 
            {
                $lookup:{
                    from:"subsscription",
                    localField:"_id",
                    foreignField:"subscribers" ,
                    as: "subscribedTo"
                }
            },{// here we count subscriber 
                $addFields:{
                    subscribersCount: {
                        $size: "$subscribers"
                    },// here we can subscribe channel 
                    channelSubscribedToCount:{
                        $size: "$subscribedTo"
                    },
                    isSubscribed:{
                        $cond:{
                            if:{$in: [req.user?._id , "$subscribers.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },{// project used to do not to project all value at demand but provided selected thing
                $project:{
                    fullname: 1,
                    username : 1,
                    SubscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage:1,
                    email: 1,
                }
            }
          ])
          if(!channel?.length){
            throw new ApiError(400 , "channnel does not exist")
          }

          return res.status(200).json(new ApiResponse(200 , channel[0] , "user channel fectched succesfully"));
    })

    const getWacthHistory= asyncHandler(async(req, res)=>{
        const user = await User.aggregate([
            {
                $macth:{
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },{
                $lookup:{
                    from: "vedios",
                    localField: "watchHistory",
                    foreignField: "_id",
                    as: "watchHistory",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                        $project :{
                                            fullName: 1,
                                            username:1,
                                            avatar: 1,
                                        }
                                    },
                                    {
                                        $addFields:{
                                            owner:{
                                                $first: "$owner"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ])
        return res.status(200).json(new ApiResponse(200 , user[0] , "watchHistory fecth succesfully"))
    })
export { registerUser , login , logoutUser ,getWacthHistory,  refreshAcessToken , changeCurrentPassword , getCurrentUser , updateAccountDetails , updateUserAvatar , updatecoverImage, getUserChannelProfile }