import { Router } from "express";

import {upload} from "../middlewares/multer.js"
import { verifyJwt } from "../middlewares/auth.js";
import {registerUser , login , logoutUser ,getWacthHistory,  refreshAcessToken , changeCurrentPassword , getCurrentUser , updateAccountDetails , updateUserAvatar , updatecoverImage, getUserChannelProfile } from "../controllers/User.js"


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
    router.route("/login").post(login)

    //secured routes 
    router.route("/logout").post(verifyJwt  , logoutUser),
    router.route("/refresh-token").post(refreshAcessToken),
    router.route("/change-password").post(verifyJwt , changeCurrentPassword),
    router.route("/current-user").get(verifyJwt , getCurrentUser),
    router.route("update-account").patch(verifyJwt ,updateAccountDetails ),
    router.route("/avatar").patch(verifyJwt , upload.single("avatar") , updateUserAvatar)
    router.route("/cover-image").patch(verifyJwt , upload.single("cover-image"), updatecoverImage),
    router.route("/c/:username").get(verifyJwt , getUserChannelProfile),
    router.route("/history").get(verifyJwt , getWacthHistory)
export default router;