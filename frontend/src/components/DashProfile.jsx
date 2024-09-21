import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {TextInput, Button} from 'flowbite-react'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import {Alert} from 'flowbite-react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateInStart, updateInSuccess, updateInFailure } from '../redux/user/userSlice'
import {useDispatch} from 'react-redux'

const DashProfile = () => {

  const {currentUser} = useSelector(state => state.user)
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
      dispatch(updateInStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if(!res.ok){
        dispatch(updateInFailure(data.message))
        setUpdateUserError(data.message)
      }else{
        dispatch(updateInSuccess(data.message)) 
        setUpdateUserSuccess('User updated successfully')
      }
    } catch (error) {
      dispatch(updateInFailure(error.message))
      setUpdateUserError(error.message)
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

        <Button type='submit' gradientDuoTone='purpleToPink' outline>Update</Button>
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
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
    </div>
  )
}

export default DashProfile