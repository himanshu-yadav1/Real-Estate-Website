import express from 'express'
import connectDB from './db/index.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import listingRouter from './routes/listing.routes.js'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path';

const app = express()
const port = process.env.PORT

const __dirname = path.resolve();

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/listing', listingRouter)

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
})

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

