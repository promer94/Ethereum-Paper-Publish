import React, { Component } from 'react'
import { Link } from '@reach/router'
import { connect } from 'react-redux'
import { fetchPaper } from '../action/action'
import PaperListItem from '../Component/PaperListItem'
//TODO: Checkbox filter
class Dashboard extends Component {
	state = {
		showOnlyYou: false,
		filter: ''
	}

	componentDidMount() {
		const { dispatch, addresses } = this.props
		dispatch(fetchPaper(addresses))
	}

	handleCheckbox = () => {
		this.setState(prevState => ({ showOnlyYou: !prevState.showOnlyYou }))
	}

	handleChange = e => {
		this.setState({ filter: e.target.value })
	}

	render() {
		const { showOnlyYou, filter } = this.state
		const { paperList } = this.props
		return (
			<div className="section">
				<div className="row">
					<div className="col s3 xl3 hide-on-small-only">
						<ul className="collection">
							<li className="input-field col">
								<i className="material-icons prefix">search</i>
								<input
									type="text"
									value={filter}
									onChange={this.handleChange}
								/>
							</li>
						</ul>
						<ul className="collection">
							<li className="collection-item"onClick={this.handleCheckbox} /*eslint-disable-line*/ >
								<input
									type="checkbox"
									className="filled-in"
									checked={showOnlyYou}
									onClick={this.handleCheckbox}
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
					<div className="col s12 m9 l9">
						{Array.isArray(paperList)
							? paperList
									.filter(
										item =>
											item.description.includes(filter) ||
											item.address.includes(filter)
									)
									.map(item => <PaperListItem key={item.address} {...item} />)
							: null}
					</div>
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
