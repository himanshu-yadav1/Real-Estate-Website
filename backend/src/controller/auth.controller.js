import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import errorHandler from "../utils/ErrorHandler.js"
import jwt from 'jsonwebtoken'

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

const signIn = async(req, res, next) => {
    try {
        
        const {email, password} = req.body

        const userFound = await User.findOne({email})

        if(!userFound){
            return next(errorHandler(404, "Couldn't found your Account"))
        }

        const isPasswordCorrect = await bcrypt.compare(password, userFound.password)

        if(!isPasswordCorrect){
            return next(errorHandler(401, "Wrong credentials"))
        }

        const token = jwt.sign({id: userFound._id}, process.env.JWT_SECRET)

        const user = await User.findById(userFound._id).select("-password")

        return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true})
        .json({user, statusCode: 200, message: "Login Successfull"})

    } catch (error) {
        next(error)
    }
}

const googleAuth = async(req, res, next) => {
    try {

        const userAlreadyRegistered = await User.findOne({ email: req.body.email })

        if (userAlreadyRegistered) {
            const token = jwt.sign({ id: userAlreadyRegistered._id }, process.env.JWT_SECRET)

            const user = await User.findById(userAlreadyRegistered._id).select("-password")

            return res
            .status(200)
            .cookie('access_token', token, { httpOnly: true})
            .json({user, statusCode: 200, message: "Sign in Successfull"}) 

        } else {
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(generatedPassword, 10)

            const newUser = await User.create(
                {
                    username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                    email: req.body.email,
                    password: hashedPassword,
                    avatar: req.body.photo
                }
            )

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

            const user = await User.findById(newUser._id).select("-password")

            return res
            .status(200)
            .cookie('access_token', token, { httpOnly: true})
            .json({user, statusCode: 200, message: "Sign up Successfull"}) 
                
        }
        
    } catch (error) {
        next(error)
    }
}

const signOut = async(req, res, next) => {
    try {
        res
        .status(200)
        .clearCookie('access_token')
        .json({statusCode: 200, message: 'sign out successfully'}) 
        
    } catch (error) {
        next(error)
    }
}

export {
    signUp,
    signIn,
    googleAuth,
    signOut
}