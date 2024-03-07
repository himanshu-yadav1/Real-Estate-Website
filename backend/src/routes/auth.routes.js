import { Router } from "express";
import { signUp } from "../controller/auth.controller.js";

const router = Router()

router.post('/signup', signUp)

export default router