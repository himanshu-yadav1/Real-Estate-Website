import { Router } from "express";
import { deleteUser, getListings, updateUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/update/:id', verifyJWT, updateUser)
router.delete('/delete/:id', verifyJWT, deleteUser)
router.get('/listings/:id', verifyJWT, getListings)

export default router