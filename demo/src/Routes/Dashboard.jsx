import React, { Component } from 'react'
import { Link } from '@reach/router'
import { connect } from 'react-redux'
import { fetchPaper } from '../action/action'

class Dashboard extends Component {
	state = {
		showOnlyYou: false
	}

	componentDidMount() {
		const { dispatch, addresses } = this.props
		dispatch(fetchPaper(addresses))
	}

	handleCheckbox = () => {
		this.setState(prevState => ({ showOnlyYou: !prevState.showOnlyYou }))
	}

	render() {
		const { showOnlyYou } = this.state
		return (
			<div className="section">
				<div className="row">
					<div className="col s3 xl3 hide-on-small-only">
						<ul className="collection">
							<li className="input-field col">
								<i className="material-icons prefix">search</i>
								<input type="text" />
							</li>
						</ul>
						<ul className="collection">
							<li className="collection-item" onClick={this.handleCheckbox}>
								<input
									type="checkbox"
									className="filled-in"
									checked={showOnlyYou}
								/>
								<span>Your paper only</span>
							</li>
							<Link
								className="waves-effect waves-light collection-item"
								to="newpapercontract"
							>
								New Paper Contract
							</Link>
						</ul>
					</div>
					<div className="col s12 m9 l12" />
				</div>
			</div>
		)
	}
}
const mapStatetoProps = state => {
	return {
		addresses: state.paper.paperAddresses,
		paperList: state.paper.paperList,
		isPending: state.paper.isPending
	}
}
export default connect(mapStatetoProps)(Dashboard)
