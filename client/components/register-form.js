import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { register } from '@client/reducers/register'
import { hideModals, REGISTER_FORM } from '@client/reducers/modals'
import * as Modals from '@client/reducers/modals'
import AnimationLoading from './animation-loading'
import Button from './button'
import TextField from './text-field'

import '@client/styles/register-form.styl'

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
    const { dispatch, error, isFetching, open, mode } = this.props
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
          <div className="label">
            Repeat your password:
          </div>
          <TextField
            type="password"
            value={passwordRepeated}
            onChange={event => this.setState({ passwordRepeated: event.target.value })} />

          {errorMessage}
        </Fragment>
    }

    return (
      <div id="register-form"
        className={'modal-shadow' +
                   (open ? ' open' : '') +
                   (mode === Modals.MODAL_FLOATING ? ' floating' : ' sticky')}>

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
            <Button
              id="rf-submit"
              type="submit"
              attrs={{ disabled: isFetching }}>
              JOIN
            </Button>
            <Button
              id="rf-close"
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
  ({ register, modals }) => ({
    error: !register.isFetching && register.error,
    isFetching: register.isFetching,
    open: modals.openModal === REGISTER_FORM,
    mode: modals.mode
  })
)(RegisterForm)