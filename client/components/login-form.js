import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { shape, bool, string, func } from 'prop-types'

import { login } from '../reducers/login'
import { hideLoginForm } from '../reducers/login-form'
import '../../common/util' // Function.prototype.bindArgs
import '../styles/login-form.styl'

class LoginForm extends Component {
  state = {
    username: '',
    password: ''
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
    const { username, password } = this.state

    let errorMessage = error ? <div id="lf-error">{error}</div> : ''

    let content

    if (isFetching) {
      content = 'Loading...'
    } else {
      content =
        <Fragment>
          <input
            className="text-field"
            ref={input => this.textUsername = input}
            type="text"
            value={username}
            onChange={event => this.setState({ username: event.target.value })}
            autofocus />
          <input
            className="text-field"
            type="password"
            value={password}
            onChange={event => this.setState({ password: event.target.value })} />
          {errorMessage}
        </Fragment>
    }

    return(
      <div id="login-form" className={'modal-shadow' + (open ? ' open' : '')}>
        <form id="lf-form"
          onKeyUp={(event) => {
            if (event.keyCode === 27) {
              dispatch(hideLoginForm())
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()

            dispatch(login(username, password))
              .then(
                () => dispatch(hideLoginForm()),
                () => this.focusTextUsername()
              )
          }}>

          {content}
          <div id="lf-buttons" className="button-group">
            <button
              className="button"
              id="lf-submit"
              type="submit"
              disabled={isFetching}>
              LOGIN
            </button>
            <button
              className="button"
              id="lf-close"
              type="button"
              onClick={() => dispatch(hideLoginForm()) }>
              ×
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  ({ login, loginForm }) => ({
    isFetching: login.isFetching,
    error: !login.isFetching && login.error,
    open: loginForm.open
  })
)(LoginForm)