import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from '@reach/router'
import { Loader } from 'react-loaders'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import { getVersions } from '../action/action'
import VersionListItem from '../Component/VersionListItem'

class Details extends Component {
	static timer = []

	state = {
		onlyUnpublished: false,
		filter: '',
		isLoading: true
	}

	componentDidMount() {
		const [address, versionCount] = this.props.address //eslint-disable-line
			.split(',')
			.map(v => v.trim())
		const { dispatch, user } = this.props
		dispatch(getVersions(address, versionCount, user))
		Details.timer.push(
			setTimeout(() => {
				this.setState({ isLoading: false }, () => {
					const { paperList } = this.props
					if (paperList && paperList.length !== 0)
						toast.success('All Papers loaded')
				})
			}, 2000)
		)		  //eslint-disable-line
	}

	componentWillUnmount() {
		this.handleChange.cancel()
		Details.timer.forEach(i => clearTimeout(i))
	}

	handleCheckbox = () => {
		this.setState(prevState => ({
			onlyUnpublished: !prevState.onlyUnpublished
		}))
	}

	handleChange = debounce(value => {
		this.setState({ filter: value })
	}, 2000)

	render() {
		const { onlyUnpublished, filter, isLoading } = this.state
		const { versionList, user, isPending } = this.props
		const [address, versionCount] = this.props.address //eslint-disable-line
			.split(',')
		.map(v => v.trim()) //eslint-disable-line
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
									onChange={e => this.handleChange(e.target.value)}
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
								to={`/NewVersion/${address}`}
							>
								New Version Now
							</Link>
						</ul>
					</div>
					<div className="col s12 m9 L9">
						<blockquote>
							<h3>
								{Array.isArray(versionList)
									? `${versionList[0].versionDescription} version details`
									: null}
							</h3>
						</blockquote>
						{isPending || isLoading ? (
							<div className="flexbox-centering">
								<Loader type="ball-grid-pulse" />
							</div>
						) : Array.isArray(versionList) ? (
							onlyUnpublished ? (
								versionList
									.filter(
										item =>
											(item.versionDescription.includes(filter) &&
												item.isArray === true) ||
											(item.md5.includes(filter) && item.isPublished === false)
									)
									.map(item => <VersionListItem key={item.md5} {...item} />)
							) : (
								versionList
									.filter(
										item =>
											item.versionDescription.includes(filter) ||
											item.versionAddress.includes(filter)
									)
									.map(item => (
										<VersionListItem key={item.md5} {...item} user={user} />
									))
							)
						) : null}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.user.address,
	versionList: state.paper.versions,
	isPending: state.paper.isPending
})

export default connect(mapStateToProps)(Details)
