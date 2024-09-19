import React from 'react'
import {Footer} from 'flowbite-react'
import {Link} from 'react-router-dom'
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsGithub } from "react-icons/bs";
import { BsDribbble } from "react-icons/bs";






const FooterComp = () => {
  return (
    <Footer container className='border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='w-full grid justify-between sm:flex md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                    <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>MERN</span>
                    APP
                    </Link>
                </div>

                <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                    <Footer.Title title='About'/>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://www.mongodb.com/' target='_blank' rel='noopener noreferrer'>
                            MONGODB
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://expressjs.com/' target='_blank' rel='noopener noreferrer'>
                            EXPRESS
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://react.dev/' target='_blank' rel='noopener noreferrer'>
                            REACT
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://nodejs.org/en' target='_blank' rel='noopener noreferrer'>
                            NODEJS
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='FOLLOW US'/>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://www.mongodb.com/resources/languages/mern-stack' target='_blank' rel='noopener noreferrer'>
                            MERN APP
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link href='https://www.mongodb.com/resources/languages/mern-stack-tutorial' target='_blank' rel='noopener noreferrer'>
                            MERN GUIDES
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                    <div>
                    <Footer.Title title='LEGAL'/>
                    <Footer.LinkGroup col>
                        <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                            Privacy policy
                        </Footer.Link>
                    </Footer.LinkGroup>
                    <Footer.LinkGroup col>
                        <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                            Terms &amp; Conditions
                        </Footer.Link>
                    </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className='w-full sm:flex sm:items-center sm:justify-between mb-2'>
                <Footer.Copyright href='#' by='MERN APP' year={new Date().getFullYear()}/>
            
            <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                <Footer.Icon href='#' icon={BsFacebook }/>
                <Footer.Icon href='#' icon={BsInstagram  }/>
                <Footer.Icon href='#' icon={BsTwitter  }/>
                <Footer.Icon href='#' icon={BsGithub  }/>
                <Footer.Icon href='#' icon={BsDribbble  }/>
            </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterComp