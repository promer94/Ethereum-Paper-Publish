import React from 'react'
import { connect } from 'react-redux'
import { Loader } from 'react-loaders'
import { approveVersion } from '../action/action'

const md5js = require('js-md5')

const validateForm = (value, target) => {
	const md5 = value
	if (md5.length === target) {
		return { isValidate: true }
	}
	return { isValidate: false }
}
class VersionListItem extends React.Component {
	state = {
		isValidate: false,
		currentFile: ''
	}

	handelChange = e => {
		const file = e.target.files[0]
		if (file !== undefined)
			this.fileHash(file, md5js, md5 => {
				this.setState({ currentFile: md5 })
			})
		this.setState(prevState => ({
			isValidate: validateForm(prevState.currentFile)
		}))
	}

	handleSubmit = e => {
		e.preventDefault()
		const { versionNumber, md5, dispatch, user, versionAddress } = this.props
		dispatch(approveVersion(versionNumber + 1, md5, versionAddress, user))
	}

	fileHash = (file, md5, callback) => {
		const reader = new FileReader()
		reader.onload = function(e) {
			callback.call(this, `0x${md5(e.target.result)}`)
		}
		reader.readAsArrayBuffer(file)
	}

	render() {
		const {
			versionDescription,
			versionNumber,
			metadata,
			isPublished,
			md5,
			isSigned,
			isPending
		} = this.props
		const { isValidate, currentFile } = this.state
		return (
			<div className="card white hoverable">
				<div className="card-content black-text">
					<span className="cart-title flow-text">{versionDescription}</span>
					<p className="flow-text">{metadata}</p>
					<p className="flow-text">{`Version Number: ${versionNumber + 1}`}</p>
				</div>
				{isPublished ? (
					<div className="card-action">
						<p>
							MD5 <span className="red-text">{md5}</span>
						</p>
					</div>
				) : null}
				{isSigned ? null : (
					<div className="card-action">
						<form onSubmit={this.handleSubmit} className="red lighten-5">
							<div className="input-field file-field">
								<div className="btn no-autoinit red lighten-2">
									<span>File</span>
									<input
										className="no-autoinit"
										type="file"
										onChange={this.handelChange}
									/>
								</div>
								<div className="file-path-wrapper no-autoinit">
									<input
										type="text"
										value={currentFile}
										className="no-autoinit validate"
									/>
								</div>
							</div>
							<div className="input-field">
								<div className="flexbox-centering ">
									{isPending ? (
										<Loader type="pacman" />
									) : (
										<button
											className={
												isValidate
													? 'waves-effect waves-light btn red lighten-2 '
													: 'waves-effect waves-light btn red lighten-2 disabled'
											}
											type="submit"
										>
											Approve
										</button>
									)}
								</div>
							</div>
						</form>
					</div>
				)}
			</div>
		)
	}
}
export default connect(state => ({
	isPending: state.paper.isPending,
	user: state.user.address
}))(VersionListItem)
