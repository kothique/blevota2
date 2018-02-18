import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { register } from '../reducers/register'
import { hideModals, REGISTER_FORM } from '../reducers/modals'
import AnimationLoading from './animation-loading'

import '../styles/register-form.styl'

class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    passwordRepeated: ''
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      this.focusTextUsername()
    }
  }

  focusTextUsername() {
    this.textUsername.focus()
  }

  render() {
    const { dispatch, error, isFetching, open } = this.props
    const { username, password, passwordRepeated } = this.state

    const errorMessage = error ? <div id="lf-error">{error}</div> : ''

    let content

    if (isFetching) {
      content = <AnimationLoading />
    } else {
      content =
        <Fragment>
          <div className="label">
            Username:
          </div>
          <input
            className="text-field"
            ref={input => this.textUsername = input}
            type="text"
            value={username}
            onChange={event => this.setState({ username: event.target.value })} />
          <div className="label">
            Password:
          </div>
          <input
            className="text-field"
            type="password"
            value={password}
            onChange={event => this.setState({ password: event.target.value })} />
          <div className="label">
            Repeat your password:
          </div>
          <input
            className="text-field"
            type="password"
            value={passwordRepeated}
            onChange={event => this.setState({ passwordRepeated: event.target.value })} />

          {errorMessage}
        </Fragment>
    }

    return (
      <div id="register-form" className={'modal-shadow' + (open ? ' open' : '')}>
        <form id="rf-form"
          onKeyUp={(event) => {
            if (event.keyCode === 27) {
              dispatch(hideModals())
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()

            dispatch(register(username, password, passwordRepeated))
              .then(
                () => dispatch(hideModals()),
                () => this.focusTextUsername()
              )
          }}>

          {content}
          <div id="rf-buttons" className="button-group">
            <button
              className="button"
              id="rf-submit"
              type="submit"
              disabled={isFetching}>
              JOIN
            </button>
            <button
              className="button"
              id="rf-close"
              type="button"
              onClick={() => dispatch(hideModals())}>
              ×
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  ({ register, modals }) => ({
    error: !register.isFetching && register.error,
    isFetching: register.isFetching,
    open: modals.openModal === REGISTER_FORM
  })
)(RegisterForm)