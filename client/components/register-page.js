import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { shape, bool, string, func } from 'prop-types'

import { register } from '../reducers/register'

class RegisterPage extends Component {
  static propTypes = {
    register: shape({
      isFetching: bool.isRequired,
      error: string
    }).isRequired,
    onRegister: func.isRequired
  }

  state = {
    username: '',
    password: '',
    passwordRepeated: ''
  }

  render() {
    const { register, onRegister } = this.props
    const { username, password, passwordRepeated } = this.state

    return (
      <main id="register-page">
        {register.isFetching
          ? 'Fetching...'
          : register.error
        }
        <form onSubmit={onRegister.bindArgs(username, password, passwordRepeated)}>
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
          <input
            type="password"
            value={passwordRepeated}
            onChange={event => this.setState({ passwordRepeated: event.target.value })} />
          <br />
          <button type="submit">
            Register
          </button>
        </form>
      </main>
    )
  }
}

export default connect(
  (state) => ({
    register: state.register
  }),
  (dispatch) => ({
    onRegister: (username, password, passwordRepeated, event) => {
      event.preventDefault()

      dispatch(register(username, password, passwordRepeated))
        .then(
          () => {
            dispatch(push('/login'))
          },
          () => {})
    }
  })
)(RegisterPage)