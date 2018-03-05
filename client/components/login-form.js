import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { login } from '@client/reducers/login'
import { hideModals, LOGIN_FORM } from '@client/reducers/modals'
import AnimationLoading from './animation-loading'
import Button from './button'
import TextField from './text-field'

import '@client/styles/login-form.styl'

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
          <TextField
            inputRef={input => this.textUsername = input}
            value={username}
            onChange={event => this.setState({ username: event.target.value })} />
          <div className="label">
            Password:
          </div>
          <TextField
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
              dispatch(hideModals())
            }
          }}
          onSubmit={(event) => {
            event.preventDefault()

            dispatch(login(username, password))
              .then(
                () => dispatch(hideModals()),
                () => this.focusTextUsername()
              )
          }}>

          {content}
          <div id="lf-buttons" className="button-group">
            <Button
              id="lf-submit"
              type="submit"
              attrs={{ disabled: isFetching }}>
              LOGIN
            </Button>
            <Button
              id="lf-close"
              type="button"
              onClick={() => dispatch(hideModals())}>
              ×
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(
  ({ login, modals }) => ({
    error: !login.isFetching && login.error,
    isFetching: login.isFetching,
    open: modals.openModal === LOGIN_FORM
  })
)(LoginForm)