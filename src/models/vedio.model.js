import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
 
const vedioSchema = new mongoose.Schema({
   vedioFile:{
    type: String,
    required:true,
   },
   thumbnail:{
      type:String,
      required: true
   },
   description:{
      type:String,
      required: true
   },
   duration:{
      type:Number,
      required: true
   },
   views:{
      type: Number,
      default: 0
   },
   isPublished:{
      type: Boolean,
      default: true,

   },
   owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }


},{timestamps: true})



vedioSchema.plugin(mongooseAggregatePaginate)
// we need to add mongooseAggregatePaginate from plugin as it come lataer  so it not used as default in mongoose coz of that we ned to define plaugin 

export const Vedio = mongoose.model("Vedio" , vedioSchema)