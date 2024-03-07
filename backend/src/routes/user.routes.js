import { Router } from "express";
import { test } from "../controller/user.controller.js";

const router = Router()

router.get('/', test)

export default router