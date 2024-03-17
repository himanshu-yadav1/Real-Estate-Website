import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import errorHandler from "../utils/ErrorHandler.js"

const updateUser = async(req, res, next) => {
    try {
        const userId = req.params.id

        if(req.user.id != userId){
            next(errorHandler(400, "Unauthorized user"))
        }

        const {updatedUsername, updatedEmail, updatedPassword, updatedProfileUrl} = req.body

        let hashedPassword;
        if(updatedPassword){
            hashedPassword = await bcrypt.hash(updatedPassword, 10)
        }
    
    
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set:{
                username: updatedUsername,
                email: updatedEmail,
                password: hashedPassword,
                avatar: updatedProfileUrl
            }
        }, {new: true})


        const user = await User.findById(updatedUser._id).select("-password")

        return res
        .status(200)
        .json({user, statusCode: 200, message: "Updated details successfully"})


    } catch (error) {
        next(error)
    }
}

export {
    updateUser
}