import {playlist, playlist} from "../models/playlist.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import {User} from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler"
import { Vedio } from "../models/vedio.model"

// here first we create a playlist 

const newPlaylist = asyncHandler(async(req , res)=>{
    const userId = req.user._id
    const {name, description} = req.body
    const {vedioId} = req.query._id


    const user = await User.findById(userId)
    const vedio =await Vedio.findById(vedioId)
    

    // check if they real exist in variable or not 

    if(!user){
        throw new ApiError(400 ," useer not fount error from controller/playlist line23" )
    }
    if(!vedio){
        throw new ApiError(400 , "vedio  not found error from contorlller/playlist file line no 26 ")
    }
    if(name.length==0){
        throw new ApiError(400,  "name to daal bhai error from controller/playlist")
    }
    

    const createdplaylist = await playlist.create({
        name : name ,
        description: description ||"",
        vedios: [vedio],
        owner: userId,
    })
    
    return res.status(200).json(200 , createdplaylist , " new playlist create successfully");
}) 

// to add vedio in plalist 
const addVedioPlay= asyncHandler(async(req, res)=>{
   // to add vedio into playist we need a vedioId and a playlist id 
   const {vedioId , playlistId}= req.query

   // finding them in database 
   const vedio = await Vedio.findById(vedioId);
   const playlist = await playlist.findById(playlistId);

  if(!vedio){
    throw new ApiError(400 , " vedio is not found errr: conroller/plaulist line 53")
  }
  if(!playlist){
    throw new ApiError(400 , " plalist is not found err: controller/ playlsist line 56")

  }

  // here had to make a check that check for is vedio is   not presented 
    // leaveing it for later to do
    const check = playlist.vedios.includes(vedioId);
    if(check){
        throw new ApiError(new ApiResponse(400 , " this vedio is already present in playlist "))
    } 


    //adding vedio
    playlist.vedios.push(vedioId);
    const addedVedio = await playlist.save();
    return res.status(200).json(new ApiResponse(200, addedVedio , "vedio added in playlist"))
})

// to remove plalist 

const removeVedioPlay = asyncHandler(async(req, res)=>{
   // here we need again a vedioid and playlist to provide reference 
   const {vedioId , playlistId}= req.query

   // finding them in database 
   const vedio = await Vedio.findById(vedioId);
   const currplaylist = await playlist.findById(playlistId);

  if(!vedio){
    throw new ApiError(400 , " vedio is not found errr: conroller/plaulist line 85")
  }
  if(!currplaylist){
    throw new ApiError(400 , " plalist is not found err: controller/ playlsist line 88")

  }
  const updatedplay = await playlist.findByIdAndUpdate(playlistId ,{ $pull:{vedios: vedioId}} , {new: true})
  res.status(200).json(new ApiResponse(200 , updatedplay ,"vedio removed from plalist succesfully  "))
})

// to show all vedio in a playlist 

const displayVedio = asyncHandler(async(req , res)=>{
    // here we need playlist id just to show all vedio 

    const{playlistId}= req.query
    
    const currplalist = await playlist.findById(playlistId).populate('vedios')

    if(!currplalist){
        throw new ApiError(400 , "plalist is not found error: contoller/plalist line no 105")
    }

    // if it presnt show now i need to show all 

    // and to show we need to find all vedio and then use pagination and morely popule by name username and description if needded
     // here pagination can be done later
    return res.status(200).json({
       status: 200 ,
       message: "the playislt fecthed succesfully",
       playlist:{
        name: currplalist.name,
        description: currplalist.description,
        vedios: currplalist.vedios
       } 
    })

})
