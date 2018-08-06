import React, { Component } from 'react'
import { Link } from '@reach/router'
export default class Dashboard extends Component {
	render() {
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
							<li className="collection-item">
								<input type="checkbox" className="filled-in" />
								<span>Show your paper only</span>
							</li>
							<li className="collection-item">
								<Link className="waves-effect waves-light" to="/dashboard">
									New Paper Contract
								</Link>
							</li>
						</ul>
					</div>
					<div className="col s12 m9 l12">
					</div>
				</div>
			</div>
		)
	}
}
