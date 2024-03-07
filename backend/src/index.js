import express from 'express'
import connectDB from './db/index.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/auth', authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"

    return res
        .status(statusCode)
        .json(
            {
                success: false,
                statusCode,
                message
            }
        )
})



connectDB()
.then( () => {
    app.listen(port, () => {
        console.log(`listen on http://localhost:${port}`)
    })
})

