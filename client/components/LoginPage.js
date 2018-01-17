import React, { Component } from 'react'
import { connect } from 'react-redux'

class LoginPage extends Component {
  state = {
    username: '',
    password: ''
  }

  onSubmit = event => {
    event.preventDefault()
  }

  render() {
    const { username, password } = this.state

    return (
      <main id="login-page">
        <form onSubmit={this.onSubmit}>
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

export default connect()(LoginPage)