import { FileInput, Select, TextInput, Button, Alert} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getStorage, ref, uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState } from 'react'

const CreatePost = () => {

    const [file,setFile] = useState(null)
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null)
    const [imageUploadError,setImageUploadError] = useState(null)
    const [formData,setFormData] = useState({})

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

  return (
    <div className='min-h-screen p-3 max-w-3xl mx-auto'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>

        <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/> 
                <Select>
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

            <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
            <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
        </form>
    </div>
  )
}

export default CreatePost