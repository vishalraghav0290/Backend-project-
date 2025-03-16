import {Router} from "express";
import {verifyJwt} from "../middlewares/auth.js";

import {getVideoComments, addComment, updateComment, deleteComment} from "../controllers/comment.controller.js"


const vediorouter = Router();

vediorouter.route("/vedioId/getcomments").get(verifyJwt , getVideoComments ),
vediorouter.route("/vedioId/postcomment").post(verifyJwt, addComment),
vediorouter.route("/vedioId/postupdatecomment").post(verifyJwt , updateComment),
vediorouter.route("/vedioId/postdeletecomment").post(verifyJwt , deleteComment)

export default vediorouter;