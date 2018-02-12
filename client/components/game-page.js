import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { func, string } from 'prop-types'
import { push } from 'react-router-redux'
import { decode } from 'jsonwebtoken'

import Game from '../game'
import '../css/game-page.css'
import '../css/common.css'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  componentDidMount() {
    const { dispatch, login, match } = this.props,
          { params: { matchId } } = match,
          context = document.getElementById('game'),
          info = document.getElementById('info')
    const host = 'http://localhost:3000'

    if (!login.user) {
      dispatch(push('/'))
      return
    }

    const game = this.game = new Game({
      host,
      context,
      info,
      token: login.token,
      user: login.user,
      matchId
    })

    game.on('connect', () => {
      console.log(`Successfully connected to ${host}`)
    })

    game.on('connect_error', (err) => {
      console.log(err.stack)
      dispatch(push('/'))
    })

    game.on('error', (err) => {
      console.log(err.stack)
      dispatch(push('/'))
    })

    game.on('disconnect', () => {
      console.log(`Disconnected from ${host}`)
      dispatch(push('/'))
    })
  }

  componentWillUnmount() {
    /**
     * If the client opens /game while not logged in, they get
     * redirected, and Component~componentWillUnmount gets called
     * without this.game being initialized, so we need to check it.
     */
    if (this.game) {
      this.game.stop()
    }
  }

  render() {
    return (
      <Fragment>
        <svg
          id="game"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          >
        </svg>
        <div id="info"></div>
      </Fragment>
    )
  }
}

export default connect(
  (state) => ({
    login: state.login
  })
)(GamePage)
