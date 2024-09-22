import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {TextInput, Button, Modal} from 'flowbite-react'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import {Alert} from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess} from '../redux/user/userSlice'
import {Link} from 'react-router-dom'

const DashProfile = () => {

  const {currentUser, error, loading} = useSelector(state => state.user)
  const [imageFile,setImageFile] = useState(null)
  const [imageFileUrl,setImageFileUrl] = useState(null)
  const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError,setImageFileUploadError] = useState(null)
  const filePickerRef = useRef()
  const [imageFileUploading,setImageFileUploading] = useState(false)
  const [updateUserSuccess,setUpdateUserSuccess] = useState(null)
  const [updateUserError,setUpdateUserError] = useState(null)

  const [formData,setFormData] = useState({})
  const dispatch = useDispatch()

  const [showModal,setShowModal] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  
  useEffect(() => {
    if(imageFile){
      uploadImage()
    }
  },[imageFile])

  const uploadImage = async () => {
  //  service firebase.storage {
  //    match /b/{bucket}/o {
  //      match /{allPaths=**} {
  //    allow read;
  //   allow write: if
  //   request.resource.size < 2 * 1024 * 1024 &&
  //   request.resource.contentType.matches('image/.*')
  //  }
  //   }
  //  }
  setImageFileUploading(true)
  setImageFileUploadError(null)
  const storage = getStorage(app)
  const fileName = new Date().getTime + imageFile.name
  const storageRef = ref(storage, fileName)
  const uploadTask = uploadBytesResumable(storageRef,imageFile)
  uploadTask.on('state_changed',
    (snapshot) => {
      const progress =
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setImageFileUploadProgress(progress.toFixed(0))
    },
    (error) => {
      setImageFileUploadProgress(null)
      setImageFileUploadError('Could not upload image (file must be less than 2Mb)')
      setImageFile(null)
      setImageFileUrl(null)
      setImageFileUploading(false)
      setUpdateUserError(null)
      setUpdateUserSuccess(null)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setImageFileUrl(downloadUrl)
        setFormData({...formData, profilePicture: downloadUrl})
        setImageFileUploading(false)
      })
    }
  )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
 
const handleSubmit = async (e) => {
  try{
  e.preventDefault()
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made')
      return;
    }
    if(imageFileUploading){
      setUpdateUserError('Please wait image to upload')
      return;
    }
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }
      if(res.ok){
        dispatch(updateSuccess(data)) 
        setUpdateUserSuccess('User updated successfully')
      }
      
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const handleDeleteUser = async () => {
      setShowModal(false)
      try {
        dispatch(deleteUserStart())
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        })
        const data = await res.json()
        if(data.success === false){
          dispatch(deleteUserFailure(data.message))
        }
        if(res.ok){
          dispatch(deleteUserSuccess(data))
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if(data.success === false){
        console.log(data.message)
      }
      if(res.ok){
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='text-center my-7 text-3xl font-semibold'>Profile</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input hidden type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef}/>

        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
        
        {imageFileUploadProgress && (
          <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
          strokeWidth={5} styles={{
            root:{
              weight: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            },
            path: {
              stroke: `rgb(67, 208, 97, ${imageFileUploadProgress/100})`,
            },
          }}/>
        )}

        <img src={imageFileUrl || currentUser.profilePicture} alt='user' 
        className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover
        ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}/>
        
        </div>
        {imageFileUploadError && 
        <Alert color='failure'>
        {imageFileUploadError}
        </Alert>
        }
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='Password' defaultValue={currentUser.password} onChange={handleChange}/>

        <Button type='submit' gradientDuoTone='purpleToPink' outline 
          disabled={loading || imageFileUploading}>{loading ? 'Loading': 'Update'}</Button>

        {
          currentUser.isAdmin && (
            <Link to='/create-post'>
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>Create a Post</Button>
            </Link>        
          )
        }
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <AiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mx-auto mb-4'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure want to delete your account?</h3>
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>Yes, Sure</Button>
              <Button color='gray'onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile