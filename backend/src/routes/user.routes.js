import { Router } from "express";
import { updateUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/update/:id', verifyJWT, updateUser)

export default router