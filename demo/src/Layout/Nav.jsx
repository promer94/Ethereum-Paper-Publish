import React from 'react'
import { Link } from '@reach/router'
import logo from './ethereum.svg'

export default ({ sideBar }) => {
	return (
		<header>
			<nav>
				<div className="nav-wrapper white">
					<ul className="left">
						<li>
							<h5
								className="black-text hide-on-small-only show-on-medium-and-up"
								style={{ paddingLeft: '15px' }}
							>
								Ethereum Smart Paper
							</h5>
						</li>
						<li>
							<a data-target="mobile-demo"className="show-on-small hide-on-med-and-up" /* eslint-disable-line*/>
								<i className="material-icons black-text" onClick={sideBar}/*eslint-disable-line*/>
									menu
								</i>
							</a>
						</li>
					</ul>
					<ul className="center">
						<li>
							<img
								src={logo}
								alt="logo"
								className="brand-logo"
								style={{ paddingTop: '10px', width: '48px', height: '48px' }}
							/>
						</li>
					</ul>
					<ul className="right hide-on-small-only show-on-medium-and-up">
						<li>
							<Link className="black-text waves-red" to="/">
								Home
							</Link>
						</li>
						<li>
							<Link className="black-text waves-red" to="dashboard">
								Dashboard
							</Link>{' '}
						</li>
					</ul>
					<ul className="sidenav">
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li>
							<Link to="/newPaper">New Paper Contract</Link>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	)
}
