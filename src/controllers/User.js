import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { toUnicode } from "punycode"

const generateAccessTokenandRefreshToken = async(userId)=>{
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAcessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
     await  user.save({ validateBeforeSave: false})
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
 // 
export { registerUser , loggedInUser }