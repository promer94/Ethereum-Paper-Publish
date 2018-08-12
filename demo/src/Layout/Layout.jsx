import React from 'react'
import { ToastContainer } from 'react-toastify'
import Nav from './Nav'
import Footer from './Footer'
import 'react-toastify/dist/ReactToastify.min.css'

export default ({ children, sideBar }) => {
  return (
    <div className="container">
      <ToastContainer autoclose={8000} position="bottom-left" />
      <Nav sideBar={sideBar} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
