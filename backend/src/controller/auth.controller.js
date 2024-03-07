import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import errorHandler from "../utils/ErrorHandler.js"

const signUp = async(req, res, next) => {
    try {
        
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return next(errorHandler(400, "Fill all the details for Creating account"))
        }

        // const userAlreadyPresent = await User.findOne({
        //     $or: [{username}, {email}]
        // })
        // if(userAlreadyPresent){
        //     return next(errorHandler(400, "user already present with this email or username"))
        // }

        const usernameAlreadyUsed = await User.findOne({username})
        const emailAlreadyUsed = await User.findOne({email})

        
        if(usernameAlreadyUsed && emailAlreadyUsed){
            return next(errorHandler(400, "Account already exists with this email and username"))
        }
        else if(usernameAlreadyUsed){
            return next(errorHandler(400, "Account already exists with this username"))
        }
        else if(emailAlreadyUsed){
            return next(errorHandler(400, "Account already exists with this email"))
        }
        


        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({username, email, password: hashedPassword})

        if(!user){
            return next(errorHandler(500, "Error while creating user"))
        }

        res.status(200).json({user, statusCode: 200,  message: "User Registered Successfully"})

    } catch (error) {
        return next(error)
    }
}

export {
    signUp
}