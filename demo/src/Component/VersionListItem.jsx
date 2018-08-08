import React from 'react'

export default ({
	versionDescription,
	metadata,
	isPublished,
	md5,
	isSigned
}) => {
	return (
		<div className="card white hoverable">
			<div className="card-content black-text">
				<span className="cart-title flow-text">{versionDescription}</span>
				<p className="flow-text">{metadata}</p>
			</div>
			<div className="card-action" />
		</div>
	)
}
