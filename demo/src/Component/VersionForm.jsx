import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loaders'
import { toast } from 'react-toastify'
import { throttle } from 'lodash'
import { createVersion } from '../action/action'
import web3 from '../Web3/web3'

const md5js = require('js-md5')

const validateForm = throttle(state => {
  const { description, metadata, md5 } = state
  if (description.length > 0 && metadata.length > 0 && md5.length === 34) {
    return { isValidate: true }
  }
  return { isValidate: false }
}, 3000)
class VersionForm extends Component {
  state = {
    description: '',
    metadata: '',
    md5: '',
    isValidate: false
  }

  componentDidMount() {
    const { creator } = this.props
    if (!web3.utils.isAddress(creator)) {
      toast.warn('Please unlock you metamask 🦄')
      this.handleSubmit = e => {
        e.preventDefault()
      }
    } else {
      toast.info(
        `Account which starts with\n${creator.slice(
          0,
          10
        )}\nwill be used for the next transactions 🤝`
      )
    }
  }

  componentDidUpdate() {
    const { transaction, navigate } = this.props
    if (transaction) {
      this.navTimer = setTimeout(() => {
        navigate('/dashboard')
      }, 4000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.navTimer)
  }

  fileHash = (file, md5, callback) => {
    const reader = new FileReader()
    reader.onload = function(e) {
      callback.call(this, `0x${md5(e.target.result)}`)
    }
    reader.readAsArrayBuffer(file)
  }

  handleChange = (value, id) => {
    if (id === 'file') {
      if (value !== undefined)
        this.fileHash(value, md5js, md5 => {
          this.setState({ md5 })
        })
    } else {
      const obj = {}
      obj[id] = value
      this.setState(obj)
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const version = {
			description: this.state.description, //eslint-disable-line
			metadata: this.state.metadata, //eslint-disable-line
			md5: this.state.md5, //eslint-disable-line
    }
    const { dispatch, paper, creator } = this.props
    dispatch(createVersion(paper, version, creator))
  }

  static getDerivedStateFromProps(props, state) {
    return validateForm(state)
  }

  render() {
    const { metadata, description, md5, isValidate } = this.state
    const { isPending } = this.props
    return (
      <div>
        <div className="row">
          <form className="col card red lighten-5" onSubmit={this.handleSubmit}>
            <div className="row" />
            <div className="input-field col s12">
              <input
                type="text"
                id="description"
                className="validate"
                value={description}
                onChange={e => this.handleChange(e.target.value, 'description')}
              />
              <label htmlFor="description">Paper description</label>
            </div>
            <div className="input-field col s12">
              <input
                type="text"
                id="metadata"
                className="validate"
                onChange={e => {
                  this.handleChange(e.target.value, 'metadata')
                }}
                value={metadata}
              />
              <label htmlFor="metadata">metadata</label>
            </div>
            <div className="input-field file-field col s12 no-autoinit">
              <div className="btn no-autoinit red lighten-2">
                <span>File</span>
                <input
                  className="no-autoinit"
                  type="file"
                  onChange={e => this.handleChange(e.target.files[0], 'file')}
                />
              </div>
              <div className="file-path-wrapper no-autoinit">
                <input
                  type="text"
                  className="no-autoinit validate"
                  value={md5}
                />
              </div>
            </div>
            <div className="col input-field offset-s0 offset-m10 ">
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
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  creator: state.user.address,
  isPending: state.paper.isPending,
  transaction: state.paper.transaction
})

export default connect(mapStateToProps)(VersionForm)
