// what we need to do with like 
// displaying all like over a vedio
// adding like and removing like
import {like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Vedio } from "../models/vedio.model.js"

// we get total like on  the vedio
const getAllLiked= asyncHandler(async(req , res)=>{
    const {vedioId} = req.params
    const {page=1 , limit=10}= req.query

    const Like= await like.find({vedio: vedioId}).skip((page-1)*limit(limit)).populate('likedBy', 'username'); 
    const totalLike = Like.length

    if(totalLike.length===0){
        throw new ApiError(400 , " like not found")
    }

    res.satuts(200).json(new ApiResponse(200 , totalLike , "fecthed all like on the vedio"))
})

// here we gonna add like from new user on a vedio
const addLikes = asyncHandler(async(req , res)=>{
    const {vedioId  , commentId}= req.params
    const userId =req.user._id
    
    const vedio= await Vedio.findById(vedioId)
    const user= await User.findById(userId)
    const comment = comment.findById(commentId)

    if(!vedio){
        throw new ApiError(400 , "vedio not found")
    }
    // if(!like){
    //     throw new ApiError(400, "like not found")
    // }
    // check wheather user already liked this vedio or  not 
    const allReadyLiked = like.findOne({
        $or:[
            
            {
                vedio:vedioId,  // here it mean ish wali vedio schema ma ye wali field ma user id excisted h aagr h to liked h na to na h
                likedby: userId
            },{
                comment: commentId,
                likedby: userId

            }
        ]
    })

    if(allReadyLiked){
        throw new ApiError(400 , "ek bhar like kr dia bhai ab bas kr ")

    }
    // here we gonna add new like 

    const newLike = await like.create({vedio: vedioId,likedby:userId})



    res.satuts(200).json(new ApiResponse(200,newLike ,"ur liked is added on vedio" ))
})

//here we gonna remove like 

const removeLike = asyncHandler(async(req , res)=>{
    const {vedioId}= req.params
    const userId = req.user._id

    const vedio = await vedio.findById(vedioId);
    const user =await User.findById(userId)


    const allReadyLiked = like.findOneAndDelete({
        $or:[
            
            {
                vedio:vedioId,  // here it mean ish wali vedio schema ma ye wali field ma user id excisted h aagr h to liked h na to na h
                likedby: userId
            },{
                comment: commentId,
                likedby: userId

            }
        ]
    })

   
})