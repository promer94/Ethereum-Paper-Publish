import React from 'react'
import Nav from './Nav'
import Footer from './Footer'
export default ({children, sideBar}) => {
  return (
      
      <div className="container">
        <Nav sideBar={sideBar}></Nav>
        <main>
          {children}
        </main>
        <Footer></Footer>
      </div>

  )
}
