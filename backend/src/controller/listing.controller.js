import { Listing } from "../models/listing.model.js"

const createListing = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        res
        .status(201)
        .json({statusCode: 201, listing, message: 'Listing created successfully'})
    } catch (error) {
        next(error)
    }
}

export {
    createListing
}