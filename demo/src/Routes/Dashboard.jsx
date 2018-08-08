import React, { Component } from 'react'
import { Link } from '@reach/router'
import { connect } from 'react-redux'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'
import PaperListItem from '../Component/PaperListItem'
import { updatePaper } from '../action/action'

const { rootContract } = require('../address.json')

class Dashboard extends Component {
	static timer = []

	state = {
		showOnlyYou: false,
		filter: '',
		isLoading: true
	}

	componentDidMount() {
		const props = this.props //eslint-disable-line
		props.dispatch(updatePaper(rootContract))
		Dashboard.timer.push(
			setTimeout(() => {
				this.setState({ isLoading: false }, () => {
					const { paperList } = props
					if (paperList && paperList.length !== 0)
						toast.success('All Papers loaded')
				})
			}, 2000)
		)
	}

	componentWillUnmount() {
		Dashboard.timer.forEach(v => {
			clearTimeout(v)
		})
	}

	handleCheckbox = () => {
		this.setState(prevState => ({ showOnlyYou: !prevState.showOnlyYou }))
	}

	handleChange = e => {
		this.setState({ filter: e.target.value })
	}

	render() {
		const { showOnlyYou, filter, isLoading } = this.state
		const { paperList, isPending } = this.props
		return (
			<div className="section">
				<div className="row">
					<div className="col s3 xl3 hide-on-small-only">
						<ul className="collection">
							<li className="input-field col hoverable">
								<i className="material-icons prefix">search</i>
								<input
									type="text"
									value={filter}
									onChange={this.handleChange}
								/>
							</li>
						</ul>
						<ul className="collection">
							<li className="collection-item" onClick={this.handleCheckbox} /*eslint-disable-line*/ >
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
								to="/newpapercontract"
							>
								New Paper Contract
							</Link>
						</ul>
					</div>
					<div className="col s12 m9 l9">
						{isPending || isLoading ? (
							<div className="flexbox-centering">
								<Loader type="ball-grid-pulse" />
							</div>
						) : Array.isArray(paperList) ? (
							showOnlyYou ? (
								paperList
									.filter(
										item =>
											(item.description.includes(filter) &&
												item.isArray === true) ||
											(item.address.includes(filter) && item.isAuthor === true)
									)
									.map(item => <PaperListItem key={item.address} {...item} />)
							) : (
								paperList
									.filter(
										item =>
											item.description.includes(filter) ||
											item.address.includes(filter)
									)
									.map(item => <PaperListItem key={item.address} {...item} />)
							)
						) : null}
					</div>
				</div>
			</div>
		)
	}
}
const mapStatetoProps = state => {
	return {
		paperList: state.paper.paperList,
		isPending: state.paper.isPending
	}
}
export default connect(mapStatetoProps)(Dashboard)
