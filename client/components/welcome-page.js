import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { object, func } from 'prop-types'
import { decode } from 'jsonwebtoken'

import { logout } from '../reducers/login'

class WelcomePage extends Component {
  static propTypes = {
    user: object,
    onLogout: func.isRequired
  }

  render() {
    const { login, onPlay, onLogout, onLogin, onRegister } = this.props

    let user = null
    if (!login.isFetching && login.token) {
      user = decode(login.token)
    }

    return (
      <main id="welcome-page">
        <h1 style={{ fontSize: '500%', textAlign: 'center' }}>
          Welcome to <span style={{ color: 'red' }}>Blevota 2</span>
        </h1>
        <hr />

        {login.isFetching
          ? <Fragment>
              Loading...
            </Fragment>
          : user
            ? <Fragment>
                Hi, {user.username}!<br />
                <a href='' onClick={onPlay}>
                  Play
                </a><br />
                <a href='' onClick={onLogout}>
                  Logout
                </a>
              </Fragment>
            : <Fragment>
                <a href='' onClick={onLogin}>
                  Login
                </a><br />
                <a href='' onClick={onRegister}>
                  Register
                </a>
              </Fragment>
        }
      </main>
    )
  }
}

export default connect(
  (state) => ({
    login: state.login
  }),
  (dispatch) => ({
    onLogin: (event) => {
      event.preventDefault()

      dispatch(push('/login'))
    },
    onRegister: (event) => {
      event.preventDefault()

      dispatch(push('/register'))
    },
    onPlay: (event) => {
      event.preventDefault()

      dispatch(push('/game'))
    },
    onLogout: (event) => {
      event.preventDefault()

      dispatch(logout())
    },
  })
)(WelcomePage)