import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath)return null,
        cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded succesfully ka code idhr h
        console.log("file is uplaoded on cloudinary")
    } catch (error) {
        console.log(error)
        throw error
       
    }
}

