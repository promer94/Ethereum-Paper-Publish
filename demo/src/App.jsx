import React from 'react'
import { Router } from '@reach/router'
import { connect } from 'react-redux'
import Layout from './Layout/Layout'
import Dashboard from './Routes/Dashboard'
import { updatePaper, updateUser } from './action/action'
import web3 from './Contract/web3'

class App extends React.Component {
	componentDidMount() {
		window.M.AutoInit()
		const { dispatch } = this.props
		dispatch(updatePaper('0x77A75b52cD13ea8eFee72dBfF412a4E4963B8112'))
		dispatch(updateUser(web3))
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
					<Details path="dashboard/:address" />
				</Router>
			</Layout>
		)
	}
}
export default connect()(App)
const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
)
const Details = ({ address }) => (
	<div>
		<h2>{address}</h2>
	</div>
)
