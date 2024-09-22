import { errorHandler } from "../utils/error.js"
import Post from "../models/post.model.js"

export const create = async (req,res,next) => {
    try {
        if(!req.user.isAdmin){
            return next(errorHandler(403, 'You are not allowed to create a post'))
        }

        if(!req.body.title || !req.body.content){
            return next(errorHandler(403, 'Title and content fields are required'))
        }

        const {title} = req.body

        const postTitle = await Post.findOne({title})
        if(postTitle){
            return next(errorHandler(400, 'Title already exists'))
        }
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.user.id
        })
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}