import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { object, func } from 'prop-types'
import { decode } from 'jsonwebtoken'

import { logout } from '../reducers/login'
import { matches } from '../reducers/matches'
import { newMatch } from '../reducers/new-match'

class WelcomePage extends Component {
  componentDidMount() {
    const { login, dispatch } = this.props

    const updateMatches = () => {
      if (!login.isFetching && login.user) {
        dispatch(matches())
      }
    }

    updateMatches()
    this.intervalID = window.setInterval(updateMatches, 5000)
  }

  componentWillUnmount() {
    window.clearInterval(this.timeoutID)
  }

  render() {
    const { dispatch, login, matches,
            onNewMatch, onLogout, onLogin, onRegister } = this.props

    let contentMain
    if (login.isFetching) {
      contentMain = 'Loading...'
    } else if (!login.user) {
      contentMain =
        <Fragment>
          <button onClick={() => dispatch(push('/login'))}>
            Login
          </button><br />
          <button onClick={() => dispatch(push('/register'))}>
            Register
          </button>
        </Fragment>
    } else if (login.user) {
      let contentMatches
      if (matches.isFetching) {
        contentMatches = 'Loading...'
      } else if (matches.error) {
        contentMatches =
          <span style={{ color: 'red' }}>
            Error while loading matches: {matches.error}
          </span>
      } else if (matches.matches) {
        contentMatches =
          <ul>
            {matches.matches.map((match) =>
              <li key={match.id}>
                {match.id} (players: {match.players}) <button onClick={() => dispatch(push(`/match/${match.id}`))}>join</button>
              </li>
            )}
          </ul>
      }

      contentMain =
        <Fragment>
          Hi, {login.user.username}!<br />
          <button onClick={() => dispatch(newMatch())}>
            Start New Match
          </button><br />
          <button onClick={() => dispatch(logout())}>
            Logout
          </button><br />
          <span style={{ fontWeight: 800 }}>
            Matches:
          </span>

          {contentMatches}
        </Fragment>
    }

    return (
      <main id="welcome-page">
        <h1 style={{ fontSize: '500%', textAlign: 'center' }}>
          Welcome to <span style={{ color: 'red' }}>Blevota 2</span>
        </h1>
        <hr />

        {contentMain}
      </main>
    )
  }
}

export default connect(
  (state) => ({
    login: state.login,
    matches: state.matches
  })
)(WelcomePage)