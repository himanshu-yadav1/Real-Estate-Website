import errorHandler from "../utils/ErrorHandler.js"
import jwt from 'jsonwebtoken'

export const verifyJWT = (req, res, next) => {
    const token = req.cookies.access_token

    if(!token){
        return next(errorHandler(400, "Unauthorized access"))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return next(errorHandler(402, "Forbidden"))
        }

        req.user = user
        next()
    })

}