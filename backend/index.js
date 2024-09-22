import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)

mongoose.connect(process.env.MONGO)
.then(() => console.log('Mongodb is connected'))
.catch((err) => console.log(err))


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})