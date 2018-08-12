import React from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loaders'
import { approveAuthor } from '../action/action'

class ApproveForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const { dispatch, user, contractAddress } = this.props
    const newAuthor = this.input.value
    dispatch(approveAuthor(contractAddress, newAuthor, user))
  }

  render() {
    const { isPending } = this.props
    return (
      <div>
        <div className="row">
          <form
            className="col card red lighten-5 s12"
            onSubmit={this.handleSubmit}
          >
            <div className="input-field col s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                type="text"
                id="icon_prefix"
                ref={ref => {
                  this.input = ref
                }}
                className="validate"
              />
              <label htmlFor="icon_prefix">Authors separate by comma</label>
            </div>
            <div className="col input-field offset-s0 offset-m10">
              <div className="flexbox-centering">
                {isPending ? (
                  <Loader type="pacman" />
                ) : (
                  <button
                    className="waves-effect waves-light btn red lighten-2 "
                    type="submit"
                  >
                    Request
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

export default connect(state => ({
  isPending: state.paper.isPending,
  user: state.user.address
}))(ApproveForm)
