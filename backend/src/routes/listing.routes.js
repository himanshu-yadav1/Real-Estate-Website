import { Router } from "express";
import { createListing, deleteListing } from "../controller/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/create', verifyJWT, createListing)
router.delete('/delete/:id', verifyJWT, deleteListing)

export default router