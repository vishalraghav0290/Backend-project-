import { Router } from "express";
import registerUser from "../controllers/User.js"

const router = Router();

// Add at least one route
router.route("/register").post(registerUser)

export default router;