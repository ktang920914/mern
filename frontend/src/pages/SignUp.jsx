import React from 'react'
import {Link} from 'react-router-dom'
import {Label, TextInput, Button} from 'flowbite-react'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-x-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>

        {/*left*/}

        <div className='flex-1'>
        <Link to='/' className='text-4xl font-bold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>MERN</span>
        APP
      </Link>
        <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password
        or with Google.</p>
        </div>

        {/*right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Your username'/>
              <TextInput type='text' placeholder='username' id='username'/>
            </div>
            <div className=''>
              <Label value='Your email'/>
              <TextInput type='email' placeholder='email@example.com' id='email'/>
            </div>
            <div className=''>
              <Label value='Your password'/>
              <TextInput type='password' placeholder='password' id='password'/>
            </div>
          
            <Button type='submit' gradientDuoTone='purpleToPink'>Sign up</Button>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
              <Link to='/sign-in' className='text-blue-500'>
              Sign in
              </Link>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp