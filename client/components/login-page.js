import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { shape, bool, string, func } from 'prop-types'

import { login } from '../reducers/login'
import '../../common/util' // Function.prototype.bindArgs
import '../styles/login-page.styl'

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

    let error
    if (!login.isFetching && login.error) {
      error = <div id="error">{login.error}</div>
    }

    return (
      <main id="lp-page">
        <div id="lp-header">
          <img id="lp-logo" src="/logo" /> Blevota 2
        </div>

        <form id="lp-form" onSubmit={onLogin.bindArgs(username, password)}>
          <div id="">
            <input
              class="text-field"
              type="text"
              value={username}
              onChange={event => this.setState({ username: event.target.value })}
              autoFocus />
            <br />
            <input
              class="text-field"
              type="password"
              value={password}
              onChange={event => this.setState({ password: event.target.value })} />
            <br />
          </div>
          <button
            class="button"
            id="login-button"
            type="submit">
            LOGIN
          </button>

          {error}
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