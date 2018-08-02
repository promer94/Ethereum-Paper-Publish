import React from 'react'
import logo from '../ethereum.svg'
const Header = () => {
  return (
    <header className="d-flex justify-content-center flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 border-bottom shadow-sm">
      <h5>Ethereum Smart Paper</h5>
        <img src ={logo} className="navbar-brand mr-0 mr-md-2 d-inline" style={{width:48, height:48, paddingTop:"0"}} alt="logo"></img>
    </header>
  )
}
export default Header
