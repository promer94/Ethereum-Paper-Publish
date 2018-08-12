import React from 'react'
import { Link } from '@reach/router'

export default ({ address, description, metadata, versionCount }) => {
  return (
    <div className="card white hoverable">
      <div className="card-content black-text">
        <span className="cart-title flow-text">{description}</span>
        <p className="flow-text">{metadata}</p>
      </div>
      <div className="card-action">
        <Link to={`/dashboard/${address},${versionCount}`}>Details</Link>
      </div>
    </div>
  )
}
