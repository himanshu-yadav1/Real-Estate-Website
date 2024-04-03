import { Router } from "express";
import { createListing } from "../controller/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/create', verifyJWT, createListing)

export default router