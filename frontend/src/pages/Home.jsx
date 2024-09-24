import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'

const Home = () => {

  const [posts,setPosts] = useState([])

  useEffect(() => {
   const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts')
        const data = await res.json()
        if(data.success !== false){
          setPosts(data.posts)
        }
      } catch (error) {
        console.log(error.message)
      }
   }
   fetchPosts ()
  },[])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>
          Welcome to MERN App
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm'>
        MERN is one of several variations of the MEAN stack 
        MongoDB, Express, Angular, Node, where the traditional Angular.js front-end framework is replaced with React.js.
        Other variants include MEVN MongoDB, Express, Vue, Node, and really any front-end JavaScript framework.
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline' >
        View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'> 
              <h2 className='text-2xl font-semibold text-center'>Recent posts</h2>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post}/>
                  ))}
                </div>
                <Link to='/search' className='text-lg text-teal-500 hover:underline text-center'>
                View all posts
                </Link>
            </div>
          )
        }
      </div>
    </div>
      
  )
}

export default Home