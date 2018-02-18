import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { toggleMenu } from '../reducers/menu'
import { openRegisterForm, openLoginForm } from '../reducers/modals'
import { logout } from '../reducers/login'
import LoginForm from './login-form'
import RegisterForm from './register-form'

import '../styles/header.styl'

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
            onClick={() => dispatch(openRegisterForm())}>
            Join
          </a>
          <div id="h-separator" className="h-box h-box-right"></div>
          <a className="h-nox h-box-text h-box-right"
            onClick={() => dispatch(openLoginForm())}>
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
            </div>

            <div className="xs sm">
              <a id="h-menu-button" className="h-box h-box-right"
                onClick={() => dispatch(toggleMenu())}>

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