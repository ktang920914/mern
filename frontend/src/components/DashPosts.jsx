import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Table, Button, Modal} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { AiOutlineExclamationCircle } from "react-icons/ai";

const DashPosts = () => {

  const {currentUser} = useSelector(state => state.user)
  const [userPosts,setUserPosts] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [postIdToDelete,setPostIdToDelete] = useState('')

  useEffect(() => {
  
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if(currentUser.isAdmin ){
      fetchPosts()
    }
  },[currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/post/getposts?userId/${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts])
      if(data.posts.length < 9){
        setShowMore(false)
      }
    }} catch (error) {
      console.log(error.message)
    } 
}
const handleDeletePost = async () => {
  setShowModal(false)
  try {
    const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if(data.success === false){
      console.log(data.messge)
    }
    if(res.ok){
      setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
    }
  } catch (error) {
    console.log(error.message)
  }
}


  return ( <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
   scrollbar-track-slate-100 scrollbar-thumb-slate-300
   dark:scrollbar-track-slate-700 scrollbar-thumb-slate-500'>
    {currentUser.isAdmin && userPosts.length > 0 ? (
      <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>

          {userPosts.map((post,index) => (
            <Table.Body key={index} className='divide-y'>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className='w-20 h-20 bg-gray-500 object-cover'/>
                  </Link>
                  </Table.Cell>
                <Table.Cell>
                  <Link  className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                  {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {post.category}
                </Table.Cell>
                <Table.Cell>
                  <span onClick={() => {
                    setShowModal(true); 
                    setPostIdToDelete(post._id)
                  }}
                  className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                </Table.Cell>
                <Table.Cell>
                  <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                  <span>
                    Edit
                  </span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {
          showMore && (
            <Button gradientDuoTone='purpleToPink' 
            onClick={handleShowMore}
            className='w-full self-center text-sm py-7' >Show More</Button>
          )
        }
      
      </>
    ) : (
      <p className='font-semibold text-3xl'>No post available</p>
    )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <AiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto mb-4'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete your post?</h3>
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>Yes, Sure</Button>
              <Button color='gray'onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </Modal.Body>
      </Modal>
  </div>
  )
}

export default DashPosts