import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { shape, bool, string, func } from 'prop-types'

import { login } from '../reducers/login'
import '../../common/util' // Function.prototype.bindArgs

class LoginPage extends Component {
  static propTypes = {
    login: shape({
      isFetching: bool.isRequired,
      error: string
    }).isRequired,
    onLogin: func.isRequired
  }

  state = {
    username: '',
    password: ''
  }

  render() {
    const { login, onLogin } = this.props
    const { username, password } = this.state

    return (
      <main id="login-page">
        {login.isFetching
          ? 'Fetching...'
          : login.error
         }
        <form onSubmit={onLogin.bindArgs(username, password)}>
          <input
            type="text"
            value={username}
            onChange={event => this.setState({ username: event.target.value })}
            autoFocus />
          <br />
          <input
            type="password"
            value={password}
            onChange={event => this.setState({ password: event.target.value })} />
          <br />
          <button type="submit">
            Login
          </button>
        </form>
      </main>
    )
  }
}

export default connect(
  (state) => ({
    login: state.login
  }),
  (dispatch) => ({
    onLogin: (username, password, event) => {
      event.preventDefault()

      dispatch(login(username, password))
        .then(
          () => {
            dispatch(push('/'))
          },
          () => {})
    }
  })
)(LoginPage)