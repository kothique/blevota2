import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { shape, bool, string, func } from 'prop-types'

import { login } from '../reducers/login'

class LoginPage extends Component {
  static propTypes = {
    login: shape({
      isFetching: bool.isRequired,
      error: string
    }).isRequired,
    onSubmit: func.isRequired
  }

  state = {
    username: '',
    password: ''
  }

  render() {
    const { username, password } = this.state
    const { login, onSubmit } = this.props

    return (
      <main id="login-page">
        {login.isFetching
          ? 'Fetching...'
          : (login.error
            ? login.error
            : '') }
        <form onSubmit={onSubmit(username, password)}>
          <input
            type="text"
            value={username}
            onChange={event => this.setState({ username: event.target.value })} />
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
    onSubmit: (username, password) => (event) => {
      event.preventDefault()

      dispatch(login(username, password))
        .then(
          () => {
            dispatch(push('/'))
          },
          (error) => {

          })
    }
  })
)(LoginPage)