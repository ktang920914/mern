import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div className=''>
          <h1 className='text-3xl font-semibold text-center my-7'>About MERN APP</h1>
          <div className='text-md light:text-gray-500 dark:text-gray-400 flex flex-col gap-6 font-semibold'>
            <p>
            MERN stack is a software stack that includes four open-source technologies: MongoDB, Express.js, React, and Node.js. These components provide an end-to-end framework for building dynamic web sites and web applications.

Among these technologies MongoDB is a database system, Node.js is a server-side runtime environment, Express.js is a web framework for Node.js and React is a client-side JavaScript library used for building user interfaces.

Because all components of the MERN stack support programs that are written in JavaScript, MERN applications can be written in one programming language for both server-side and client-side execution environments.
            </p>

            <p>
MongoDB is a NoSQL database program that uses JSON-like BSON binary JSON documents with schema.

The role of the database in the MERN stack is very commonly filled by MongoDB because its use of JSON-like documents for interacting with data as opposed to the row/column model allows it to integrate well with the other JavaScript-based components of the stack.
            </p>

            <p>
Express.js also referred to as Express is a modular web application framework for Node.js.

Whilst Express is capable of acting as an internet-facing web server, even supporting SSL/TLS out of the box, it is often used in conjunction with a reverse proxy such as NGINX or Apache for performance reasons.
            </p>

            <p>
            React also known as React.js or ReactJS is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.

React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with rendering data to the DOM, and so creating React applications usually requires the use of additional libraries for state management and routing.Redux and React Router are respective examples of such libraries.
            </p>
            <div className='flex items-center justify-center mt-5'>
              <img className='w-40 h-40 animate-spin-slow' src='https://www.rlogical.com/wp-content/uploads/2023/05/why-choose-mern-stack-for-developing-web-apps.webp'/>
            </div>          
          </div>
        </div>
      </div>
    </div>
  )
}

export default About