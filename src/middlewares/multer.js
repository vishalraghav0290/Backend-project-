import multer from "multer";
// to ask from yag what is need of multer and somemore details  about multer and another one package that come from  node js / expreess 
const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null, '/public ')
    },
    filename:function (req, file , cb){
        
        cb(null, file.originalname )
    }
})

export const upload = multer({storage})