import { Router } from "express";
import {registerUser} from "../controllers/User.js"
import {upload} from "../middlewares/multer.js"
import { verifyJwt } from "../middlewares/auth.js";

const router = Router();

// Add at least one route
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1

        },{
            name: "coverImage",
            maxCount:1,
        }
    ]),
    registerUser)

    //secured routes 
    router.route("/logout").post(verifyJwt  , logoutUser)

export default router;