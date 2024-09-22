import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req,res) => {
    res.json({message: 'testing api 123123'})
}

export const updateUser = async (req,res,next) => {
    try{
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update profile'))
    }

    if(req.body.email === ''){
        return next(errorHandler(400, 'Email is required'))
    }

    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }else if(req.body.password === ''){
        return next(errorHandler(400, 'Password is required'))
    }

    if(req.body.username){
        if(req.body.username.length < 6 || req.body.username.length > 12){
            return next(errorHandler(400, 'Username must be at between 6 and 12 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contains empty spaces'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username can contains only letters and numbers'))
        }
    }else if(req.body.username === ''){
        return next(errorHandler(400, 'Username is required'))
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
        },
    },{new:true})

    const {password, ...rest} = updatedUser._doc
    res.status(200).json(rest)
    }catch(error){
        next(error)
    } 
}

export const deleteUser = async (req,res,next) => {
    try {
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403 , 'You are not allowed to delete profile'))
        }

        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User is deleted')
    } catch (error) {
        next(error)
    }
}

export const signout = async (req,res,next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}