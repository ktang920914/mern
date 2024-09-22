import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default: 'https://ultranet.com.my/wp-content/uploads/2021/07/blog.png',
    },
    category:{
        type: String,
        default: 'Uncategorized',
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }
},{timestamps:true})

const Post = mongoose.model('Post', postSchema)

export default Post