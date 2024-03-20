import { Router } from "express";
import { deleteUser, updateUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/update/:id', verifyJWT, updateUser)
router.delete('/delete/:id', verifyJWT, deleteUser)

export default router