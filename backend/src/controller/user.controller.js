import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import errorHandler from "../utils/ErrorHandler.js"
import { Listing } from "../models/listing.model.js"

const updateUser = async(req, res, next) => {
    try {
        const userId = req.params.id

        if(req.user.id != userId){
            next(errorHandler(400, "Unauthorized user"))
        }

        const {updatedUsername, updatedEmail, updatedPassword, updatedProfileUrl} = req.body


        let updateFields = {};

        //username should be present && shouldn't be empty && shouldn't be just a space
        if (updatedUsername && updatedUsername !== '' && updatedUsername != ' ') {
            const isUsernameUsed = await User.findOne({username: updatedUsername})
            if(isUsernameUsed){
                return next(errorHandler(400, "Username already used"))
            }

            updateFields.username = updatedUsername;
        }
        if (updatedEmail && updatedEmail !== '' && updatedEmail !== ' ') {
            const isEmailUsed = await User.findOne({email: updatedEmail})
            if(isEmailUsed){
                return next(errorHandler(400, "Email already used"))
            }

            updateFields.email = updatedEmail;
        }
        if (updatedPassword && updatedPassword !== '' && updatedPassword !== ' ') {
            const hashedPassword = await bcrypt.hash(updatedPassword, 10);
            updateFields.password = hashedPassword;
        }
        if (updatedProfileUrl && updatedProfileUrl !== '' && updatedProfileUrl !== ' ') {
            updateFields.avatar = updatedProfileUrl;
        }
    
    
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set:{ ...updateFields }

        }, {new: true})


        const user = await User.findById(updatedUser._id).select("-password")

        return res
        .status(200)
        .json({user, statusCode: 200, message: "Updated details successfully"})


    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res, next) => {
    const userId = req.params.id

    if(req.user.id != userId){
        next(errorHandler(400, "Unauthorized user"))
    }

    try {
        await User.findByIdAndDelete(userId)
        res
        .status(200)
        .clearCookie('access_token')  //clear cookie before sending json, error if try to clear cookie after sending json 
        .json({statusCode: 200, message: "User deleted successfully"})
        
    } catch (error) {
        next(error)
    }
}

const getListings = async(req, res, next) => {
    const userId = req.params.id

    if(userId === req.user.id){
        try {
            const listings = await Listing.find({user : userId})

            res
            .status(200)
            .json(listings)
            
        } catch (error) {
            next(error)
        }

    }
    else{
        return next(errorHandler(404, "You are not authenticated to get the listings"))
    }

}

export {
    updateUser,
    deleteUser,
    getListings
} 