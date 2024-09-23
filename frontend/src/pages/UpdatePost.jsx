import { FileInput, Select, TextInput, Button, Alert} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getStorage, ref, uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import React, { useEffect, useState } from 'react'

const UpdatePost = () => {

    const [file,setFile] = useState(null)
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null)
    const [imageUploadError,setImageUploadError] = useState(null)
    const [formData,setFormData] = useState({})
    const [publishError,setPublishError] = useState(null)
    const navigate = useNavigate()
    const {postId} = useParams()
    const {currentUser} = useSelector(state => state.user)

    useEffect(() => {
        try{
        const fetchPost = async () => {
          const res = await fetch(`/api/post/getposts?postId=${postId}`)
          const data = await res.json()
          if(data.message === false){
            setPublishError(data.message)
          }
          if(res.ok){
            setPublishError(null)
            setFormData(data.posts[0])
          }
        }
          fetchPost()
        
        } catch(error){
            console.log(error.message)
        }
    },[postId]);

    const handleUploadImage = async () => {
        try {
            if(!file){
                return setImageUploadError('Please select an image')
            }
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageFileUploadProgress(progress.toFixed(0))
                  },
                  (error) => {
                    setImageUploadError('Image upload failed (file must be less than 2Mb)')
                    setImageFileUploadProgress(null)
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                      setImageFileUploadProgress(null)
                      setImageUploadError(null)
                      setFormData({...formData, image: downloadUrl})
                    })
                  })
        } catch (error) {
            setImageUploadError('Image upload failed')
            setImageFileUploadProgress(null)
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if(data.success=== false){
                setPublishError(data.message)
            }
            if(res.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError('Something went wrong')
        }
    } 

  return (
    <div className='min-h-screen p-3 max-w-3xl mx-auto'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1'
                onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title}/> 

                <Select onChange={(e) => setFormData({...formData, category: e.target.value})}
                    value={formData.category}>
                    <option value='Uncategorized'>Select a category</option>
                    <option value='Javascript'>Javascript</option>
                    <option value='React.js'>React.js</option>
                    <option value='Next.js'>Next.js</option>
                </Select>
            </div>

            <div className='flex gap-4 p-3 items-center justify-between border-4 border-teal-500 border-dotted'>
                <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline
                onClick={handleUploadImage} disabled={imageFileUploadProgress}>
                    {
                        imageFileUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar value={imageFileUploadProgress} 
                                text={`${imageFileUploadProgress || 0}% `}/>
                            </div>
                        ) : ( 'Upload image')
                    }
                </Button>
            </div>

            {imageUploadError && (
                <Alert color='failure'>{imageUploadError}</Alert>
            )}        

            {formData.image && (
                <img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>
            )}

            <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required
            onChange={(value) => setFormData({...formData, content: value})} value={formData.content}/>
            <Button type='submit' gradientDuoTone='purpleToPink'>Update</Button>

            {publishError && (
            <Alert color='failure' className='mt-5'>{publishError}</Alert>
        )}

        </form>
        
    </div>
  )
}

export default UpdatePost