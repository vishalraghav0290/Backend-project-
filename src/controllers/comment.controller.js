import mongoose from "mongoose"
import {comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Vedio } from "../models/vedio.model.js"
import {User} from"../models/user.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {vedioId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = await comment.find({
        vedio: vedioId
    }).skip((page-1)* limit).limit(limit)

    if(!comments?.length){
        throw new ApiError(400 , "no comment")
    }
    console.log(comments)
    return res.status(200).json(new ApiResponse(200, comments , "comment fecthed succesfully"))

    
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {vedioId } = req.params
    const userId = req.user?._id
    const vedio = await Vedio.findById(vedioId)
    const user = await User.findById(userId)

    if(!vedio){
         throw new ApiError(400 , "vedio not found for comment")
    }
    if(!user){
        throw new ApiError(400 , "user not found for comment")
   }
   const {comment: commentContent} = req.body
   if(!commentContent){
    throw new ApiError(400 , "enter a content to add as a comment")
   }
   const newComment = await comment.create({
    content: commentContent,
    vedio: vedioId,
    owner: userId
   })
   return res.status(201).json(new ApiResponse(201 , newComment , "comment added succeefully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment 

    // to update comment we need vedioId to idetify on which vedio comment is on and userId to find which user comment on and comment to upadate it comment also can be find throw it id
    const {vedioId} = req.params
    const userId = req.user._id
    const {commentId} = req.params

    const user = await User.findById(userId)
    const vedio = await Vedio.findById(vedioId)
    const comment = await comment.findById(commentId)
    const {updatedCommentToAdd} = req.body

    if(!comment ){
        throw new ApiError(400 , "comment not existed")
    }
    if(!user){
        throw new ApiError(400 , " user not found")
    }
    if(!vedio){
        throw new ApiError(400 , " vedio not found ")
    }
    const updatedComment = await comment.findByIdAndUpdate(commentId, {
        content : updatedCommentToAdd
    },{
        new: true // here  we used to return new true coz we need to return an updated value

    })
    return res.status(200).json(new ApiResponse(200 , updateComment , " comment updated succesfully "))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {vedioId}= req.params
    const userId = req.body._id
    const {commentId} = req.params

    const user= await User.findById(userId)
    const vedio= await Vedio.findById(vedioId)
    const currentComment = await comment.findById(commentId)

    if(!currentComment ){
        throw new ApiError(400 , "comment not existed")
    }
    if(!user){
        throw new ApiError(400 , " user not found")
    }
    if(!vedio){
        throw new ApiError(400 , " vedio not found ")
    }
     // Check if user owns the comment asked from ai 
     if (currentComment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to delete this comment");
    }

    const deletecomment= await comment.findByIdAndDelete(commentId)
    return res.status(200).json(new ApiResponse(200 , [], " comment deleted succesfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }