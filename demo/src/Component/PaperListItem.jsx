import React from 'react'
import { Link } from '@reach/router'

export default ({ address, description, metadata }) => {
	return (
		<div className="card white hoverable">
			<div className="card-content black-text">
				<span className="cart-title">{description}</span>
				<p>{metadata}</p>
			</div>
			<div className="card-action">
				<Link to={`/dashboard/${address}`}>Details</Link>
			</div>
		</div>
	)
}
