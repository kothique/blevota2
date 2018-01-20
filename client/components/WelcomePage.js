import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { object, func } from 'prop-types'

import { logout } from '../reducers/logout'

class WelcomePage extends Component {
  static propTypes = {
    user: object,
    onLogout: func.isRequired
  }

  render() {
    const { user, onLogin, onLogout } = this.props

    return (
      <main id="welcome-page">
        <h1 style={{ fontSize: '500%', textAlign: 'center' }}>
          Welcome to <span style={{ color: 'red' }}>Blevota 2</span>
        </h1>
        <hr />

        {user
          ? <Fragment>
              Hi, {user.username}!<br />
              <a href='' onClick={onLogout}>
                Logout
              </a>
            </Fragment>
          : <Fragment>
              <a href='' onClick={onLogin}>
                Login
              </a>
              {/* <Link to="/register">
                Register
              </Link> */}
            </Fragment>
        }
      </main>
    )
  }
}

export default connect(
  (state) => ({
    user: state.user.user
  }),
  (dispatch) => ({
    onLogin: (event) => {
      event.preventDefault()

      dispatch(push('/login'))
    },
    onLogout: (event) => {
      event.preventDefault()

      dispatch(logout())
    },
  })
)(WelcomePage)