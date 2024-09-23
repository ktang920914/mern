import { Textarea, Button, Alert, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import Comment from './Comment'
import { AiOutlineExclamationCircle } from "react-icons/ai";


const CommentSection = ({postId}) => {

  const {currentUser} = useSelector(state => state.user) 
  const [comment,setComment] = useState('')
  const [commentError,setCommentError] = useState(null)
  const [comments,setComments] = useState([])
  const navigate = useNavigate()
  const [showModal,setShowModal] = useState(false)
  const [commentToDelete,setCommentToDelete] = useState(null)

  const handleSubmit = async (e) => {
    try{
    e.preventDefault()
    if(comment.length > 200){
      return
    }
    const res = await fetch('/api/comment/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({content: comment, postId, userId:currentUser._id}),
    })
    const data = await res.json()
    if(data.success === false){
      setCommentError(data.message)
    }
    if(res.ok){
      setComment('')
      setComments([data,...comments])
      setCommentError(null)
    }
  }catch (error){
    setCommentError(error.message)
  }
  }

  useEffect(() => {

    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getpostcomments/${postId}`)
        const data = await res.json()
        if(res.ok){
          setComments(data)
        }

      } catch (error) {
        console.log(error.message)
      }
    }

    getComments()
  },[postId])

  const handleLike = async (commentId) => {
    try{
      if(!currentUser){
        return navigate('/sign-in')
      }
      const res = await fetch(`/api/comment/likecomment/${commentId}`, {
        method: 'PUT',
      })
      const data = await res.json()
      setComments(comments.map((comment) => 
        comment._id === commentId ? {
          ...comment,
          likes: data.likes,
          numberOfLikes:data.likes.length,
        } :  comment
      ))

      
    }catch(error){
      console.log(error.message)
    }

  }

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) => 
        c._id === comment._id ? {...c, content: editedContent} : c
      )
    )
  }

  const handleDelete = async (commentId) => {
    setShowModal(false)
    try {
      if (!currentUser) {
        navigate('/sign-in')
        return;
      }
      const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId))
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img className='h-5 w-5 rounded-full object-cover' src={currentUser.profilePicture} alt={currentUser.username}/>
          <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.  
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign in
          </Link>
        </div>
      )}

      {currentUser && ( 
        <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
          <Textarea placeholder='Add a comment' row='3' maxLength='200' 
          onChange={(e) => setComment(e.target.value)} value={comment}/>
          <div className='flex items-center justify-between mt-5'>
            <p className='text-gray-500 text-xs'>{200-comment.length} characters remaining</p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>{commentError}</Alert>
          )}
        </form>
      )}

      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => 
            <Comment key={comment._id} comment={comment} 
            onLike={handleLike} 
            onEdit={handleEdit} 
            onDelete={(commentId) => {
              setShowModal(true)
              setCommentToDelete(commentId)
            }}/>
          )}
        </>
      )}
       <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <AiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto mb-4'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete your comment?</h3>
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, Sure</Button>
              <Button color='gray'onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection