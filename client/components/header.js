import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { toggleMobileMenu } from '@client/reducers/mobile-menu'
import { toggleRegisterForm, toggleLoginForm } from '@client/reducers/modals'
import { logout } from '@client/reducers/login'
import LoginForm from './login-form'
import RegisterForm from './register-form'

import '@client/styles/header.styl'

class Header extends Component {
  render() {
    const { dispatch, user } = this.props

    let userBox
    if (user) {
      userBox =
        <Fragment>
          <a className="h-box h-box-right h-box-text"
            onClick={() => dispatch(logout())}>
            Quit
          </a>
          <div className="h-box h-box-right h-box-text">
            Hi, {user.username}!
          </div>
        </Fragment>
    } else {
      userBox =
        <Fragment>
          <a className="h-box h-box-text h-box-right"
            onClick={() => dispatch(toggleRegisterForm())}>
            Join
          </a>
          <div id="h-separator" className="h-box h-box-right"></div>
          <a className="h-nox h-box-text h-box-right"
            onClick={() => dispatch(toggleLoginForm())}>
            Login
          </a>
        </Fragment>
    }

    return (
      <Fragment>
        <header id="h-header">
          <div id="h-container">
            <a onClick={() => dispatch(push('/'))}>
              <div id="h-logo" className="h-box">
                <img src="/images/logo.svg" />
              </div>
              <div id="h-brandname" className="h-box h-box-text">
                Blevota 2
              </div>
            </a>
            <div className="md lg xl">
              <div className="h-box h-box-space"></div>
              <a className="h-box h-box-text"
                onClick={() => dispatch(push('/wiki'))}>
                Wiki
              </a>
              <a className="h-box h-box-text"
                onClick={() => dispatch(push('/regions'))}>
                Play
              </a>
            </div>

            <div className="xs sm">
              <a id="h-mobile-menu-button" className="h-box h-box-right"
                onClick={() => dispatch(toggleMobileMenu())}>

                <img src="/images/icons/menu-button.svg" />
              </a>
            </div>
            <div className="md lg xl">
              {userBox}
            </div>
          </div>
        </header>
        <LoginForm />
        <RegisterForm />
      </Fragment>
    )
  }
}

export default connect(
  ({ login }) => ({
    user: !login.isFetching && login.user
  })
)(Header)