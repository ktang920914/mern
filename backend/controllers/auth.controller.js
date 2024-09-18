import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req,res) => {
    try {
    const {username, email, password } = req.body

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(400).json({message: 'All fields are required'})
    }

    userName = await User.findOne({username})
    if(userName){
        return res.status(400).json({message: 'Username is already used'})
    }

    userEmail = await User.findOne({email})
    if(email){
        return res.status(400).json({message: 'Email is already used'})
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password:hashedPassword
    })

    await newUser.save()
    res.status(200).json({message: 'Sign up successfully'})

    } catch (error) {
    res.status(500).json({message: 'Internal Server Error'})
    }
    

}