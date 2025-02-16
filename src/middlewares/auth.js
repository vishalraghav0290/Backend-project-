import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"



export const verifyJwt = asyncHandler(async(err , req , res , next)=>{
 try {
    const token=   req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" ,"" )
   
    if(!token){
       throw new ApiError(401 , "unauthorized request")
    }
   
    // to check  does this token is corect or not 
    
    const decodedToken = jwt.verify(token , process.env.ACCESS_API_SECERT)// here later i had to add.env 
    const user =await user.findById(decodedToken?._id).select("-password -refreshToken")
   
   if(!user){throw new ApiError(401 ,"invalid Acess token")};
   
   req.user=user;
   next();
   
 } catch (error) {
    throw new ApiError(401 , error?.message || "invaldi access token")
 }
})