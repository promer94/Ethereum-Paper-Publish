import React, { Component } from 'react'
import { Link } from '@reach/router'
import { connect } from 'react-redux'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'
import { debounce } from 'lodash'
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
    const { props } = this
    props.dispatch(updatePaper(rootContract))
    /** keep update dashboard data */
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
    /** clear all timer and setState event to prevent memory leak */
    Dashboard.timer.forEach(v => {
      clearTimeout(v)
    })
    this.handleChange.cancel()
  }

  handleCheckbox = () => {
    this.setState(prevState => ({ showOnlyYou: !prevState.showOnlyYou }))
  }

  handleChange = debounce(value => {
    this.setState({ filter: value })
  }, 2000)

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
                  onChange={e => this.handleChange(e.target.value)}
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
                className="waves-effect waves-light red-text text-darken-2 collection-item"
                to="/NewPaper"
              >
                New Paper Now
              </Link>
            </ul>
          </div>
          <div className="col s12 m9 l9">
            <blockquote>
              <h3>Smart paper list</h3>
            </blockquote>
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
                  .map(item => (
                    <PaperListItem
                      key={`${item.md5}+${item.address}`}
                      {...item}
                    />
                  ))
              )
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    paperList: state.paper.paperList,
    addresses: state.paper.paperAddresses,
    isPending: state.paper.isPending
  }
}
export default connect(mapStateToProps)(Dashboard)
