import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import errorHandler from "../utils/ErrorHandler.js"

const signUp = async(req, res, next) => {
    try {
        
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return next(errorHandler(400, "all details are required for signUp"))
        }

        const userAlreadyPresent = await User.findOne({
            $or: [{username}, {email}]
        })

        if(userAlreadyPresent){
            return next(errorHandler(400, "user already present with this email or username"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({username, email, password: hashedPassword})

        if(!user){
            return next(errorHandler(500, "Error while creating user"))
        }

        res.status(200).json({user, message: "User Registered successfully"})

    } catch (error) {
        return next(error)
    }
}

export {
    signUp
}