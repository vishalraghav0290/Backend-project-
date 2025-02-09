import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configure Cloudinary with API credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your cloudinary account name
    api_key: process.env.CLOUDINARY_API_KEY  ,       // API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET // API secret for authentication
}); 

// Function to upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Return null if no file path provided
        if (!localFilePath){
            console.log("idhar tot aa")
            return null
        } ;
        
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"  
        })

          // Delete file from local server after upload
          fs.unlinkSync(localFilePath);
        
        
        return response;

    } catch (error) {
          // Delete local file if upload fails
          fs.unlinkSync(localFilePath);
      console.log(error)
        return null;
    }
}

// Export function to be used in other files
export { uploadOnCloudinary }