import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Table, Button, Modal} from 'flowbite-react'
import { AiOutlineExclamationCircle } from "react-icons/ai";


const DashComm = () => {

  const {currentUser} = useSelector(state => state.user)
  const [comments,setComments] = useState([])
  const [showMore,setShowMore] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [commentIdToDelete,setCommentIdToDelete] = useState('')

  useEffect(() => {
  
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments')
        const data = await res.json()
        if(data.success !== false){
          setComments(data.comments)
          if(data.comments.length < 9){
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if(currentUser.isAdmin ){
      fetchComments()
    }
  },[currentUser._id])

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
        setComments((prev) => [...prev, ...data.comments])
      if(data.comments.length < 9){
        setShowMore(false)
      }
    }} catch (error) {
      console.log(error.message)
    } 
}
const handleDeleteComment = async () => {
  setShowModal(false)
  try {
    const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if(data.success === false){
      console.log(data.messge)
    }
    if(res.ok){
      setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
    }
  } catch (error) {
    console.log(error.message)
  }
}


  return ( <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
   scrollbar-track-slate-100 scrollbar-thumb-slate-300
   dark:scrollbar-track-slate-700 scrollbar-thumb-slate-500'>
    {currentUser.isAdmin && comments.length > 0 ? (
      <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Comment content</Table.HeadCell>
            <Table.HeadCell>Numberr of likes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>

          {comments.map((comment) => (
            <Table.Body key={comment._id} className='divide-y'>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                 {comment.content}
                </Table.Cell>
                <Table.Cell>
                  {comment.numberOfLikes}
                </Table.Cell>
                <Table.Cell>
                  {comment.postId}
                </Table.Cell>
                <Table.Cell>
                  {comment.userId}
                </Table.Cell>
                <Table.Cell>
                  <span onClick={() => {
                    setShowModal(true); 
                    setCommentIdToDelete(comment._id)
                  }}
                  className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
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
      <p className='font-semibold text-3xl'>No comment available</p>
    )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <AiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto mb-4'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete this comment?</h3>
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>Yes, Sure</Button>
              <Button color='gray'onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </Modal.Body>
      </Modal>
  </div>
  )
}

export default DashComm