import { Router } from "express";
import { createListing, deleteListing, getListing, getListings, updateListing } from "../controller/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/create', verifyJWT, createListing)
router.delete('/delete/:id', verifyJWT, deleteListing)
router.post('/update/:id', verifyJWT, updateListing)
router.get('/get/:id', getListing)
router.get('/get/', getListings)

export default router