import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) => {
    try{
    const {username, email, password } = req.body

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return next(errorHandler(400, 'All fields are required'));
    }

    const userName = await User.findOne({username})
    if(userName){
        return next(errorHandler(400, 'Username is already used'));
    }

    const userEmail = await User.findOne({email})
    if(userEmail){
        return next(errorHandler(400, 'Email is already used'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })
    
    await newUser.save()
    res.status(201).json({message: 'Sign up successfully'})

    } catch (error) {
    next(error)
}
}

export const signin = async (req,res,next) => {
    try {
        const {email, password} = req.body

        if(!email || !password || email === '' || password === ''){
            return next(errorHandler(400, 'All fields are required'))
        }

        const validUser = await User.findOne({email})
        if(!validUser){
            return next(errorHandler(400, 'User not found'))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword){
            return next(errorHandler(400, 'Invalid credentials'))
        }

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const {password:pass,...rest} = validUser._doc

        res.cookie('access_token' , token , {
            httpOnly: true,        
        })
        res.status(200).json(rest)

        
    } catch (error) {
        next(error)
    }
}