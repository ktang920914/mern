import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

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