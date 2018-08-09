import React from 'react'
import { Router } from '@reach/router'
import { connect } from 'react-redux'
import Layout from './Layout/Layout'
import Dashboard from './Routes/Dashboard'
import Details from './Routes/Details'
import PaperForm from './Component/PaperForm'
import VersionForm from './Component/VersionForm'
import './App.css'
import { updatePaper } from './action/action'

const { rootContract } = require('./address.json')

class App extends React.Component {
	componentDidMount() {
		window.M.AutoInit()
		const { dispatch } = this.props
		dispatch(updatePaper(rootContract))
	}

	openSideBar = () => {
		const elem = document.querySelector('.sidenav')
		const instance = window.M.Sidenav.getInstance(elem)
		instance.open()
	}

	render() {
		return (
			<Layout sideBar={this.openSideBar}>
				<Router>
					<Home path="/" />
					<Dashboard path="dashboard" />
					<PaperForm path="NewPaper" />
					<VersionForm path="NewVersion/:paper" />
					<Details path="dashboard/:address" />
				</Router>
			</Layout>
		)
	}
}
export default connect()(App)
const Home = () => (
	<div className="flexbox-centering">
		<h1>HOME</h1>
	</div>
)
