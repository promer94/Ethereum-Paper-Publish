import React from 'react'
import { Router } from '@reach/router'
import Layout from './Layout/Layout'
import Dashboard from './Routes/Dashboard'
export default class App extends React.Component{
  componentDidMount(){
    window.M.AutoInit()
  }
  openSideBar = () => {
    const elem = document.querySelector('.sidenav');
    const instance = window.M.Sidenav.getInstance(elem)
    instance.open()
  }
  render(){
	return (
		<Layout sideBar={this.openSideBar}>
			<Router>
				<Home path="/" />
				<Dashboard path="/dashboard" />
			</Router>
		</Layout>
  )
}
}
const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
)
