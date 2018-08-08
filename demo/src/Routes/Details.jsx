import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from '@reach/router'
import { getVersions } from '../action/action'

class Details extends Component {
	state = {
		onlyUnpublished: false,
		filter: '',
		isLoading: true
	}

	componentDidMount() {
		const [address, versionCount] = this.props.address //eslint-disable-line
			.split(',')
			.map(v => v.trim())
		this.props.dispatch(getVersions(address, versionCount,this.props.user)) //eslint-disable-line
	}

	handleCheckbox = () => {
		this.setState(prevState => ({
			onlyUnpublished: !prevState.onlyUnpublished
		}))
	}

	handleChange = e => {
		this.setState({ filter: e.target.value })
	}

	render() {
		const { onlyUnpublished, filter, isLoading } = this.state
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
									checked={onlyUnpublished}
									onClick={this.handleCheckbox}
								/>
								<span>Unapproved version</span>
							</li>
							<Link
								className="waves-effect waves-light red-text text-darken-2 collection-item"
								to="/NewVersion"
							>
								New Version Now
							</Link>
						</ul>
					</div>
					<div className="col s12 m9 L9">
						<blockquote>
							<h3>Paper version detail</h3>
						</blockquote>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.user.address,
	versionList: state.paper.versions
})

export default connect(mapStateToProps)(Details)
