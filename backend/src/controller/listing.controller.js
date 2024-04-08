import { Listing } from "../models/listing.model.js"
import errorHandler from "../utils/ErrorHandler.js"

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

const deleteListing = async(req, res, next) => {
    const listingId = req.params.id

    try {
        const listing = await Listing.findById(listingId)
        if(!listing){
            return next(errorHandler(404, "Listing doesn't found"))
        }

        if(listing.user !== req.user.id){
            return next(errorHandler(400, "You are only allowed to delete your own listings"))
        }

        const deletedListing = await Listing.findByIdAndDelete(listingId)

        res
        .status(200)
        .json({message: 'Listing Deleted'})

    } catch (error) {
        next(error)
    }

}

const updateListing = async(req, res, next) => {
    const listingId = req.params.id

    try {
        const listing = await Listing.findById(listingId)

        if(!listing){
            return next(errorHandler(404, "Listing not found"))
        }

        if(listing.user != req.user.id){
            return next(errorHandler(402, "You can update your own listings"))
        }

        const updatedListing = await Listing.findByIdAndUpdate(listingId, req.body, { new: true })

        res
        .status(200)
        .json({updatedListing, message: "Listing updated"})

    } catch (error) {
        next(error)
    }
}

const getListing = async(req, res, next) => {
    const listingId = req.params.id

    try {
        const listing = await Listing.findById(listingId)

        if(!listing){
            return next(errorHandler(404, "Listing not found"))
        }

        res
        .status(200)
        .json(listing)


    } catch (error) {
        next(error)
    }
}

const getListings = async(req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0
        let offer = req.query.offer

        if(offer === undefined || offer === 'false'){
            offer = {$in: [false, true]}
        }

        let parking = req.query.parking

        if(parking === undefined || parking === 'false'){
            parking = {$in: [false, true]}
        }

        let furnished = req.query.furnished

        if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [false, true]}
        }

        let type = req.query.type

        if(type === undefined || type === 'all'){
            type = {$in: ['sale', 'rent']}
        }

        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        const listings = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type
        }).sort({ [sort]: order }).limit(limit).skip(startIndex)  

        return res
        .status(200)
        .json(listings)


    } catch (error) {
        next(error)
    }
}

export {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings
}