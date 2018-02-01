import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func } from 'prop-types'
import { push } from 'react-router-redux'
import { decode } from 'jsonwebtoken'

import Game from '../game'
import '../css/GamePage.css'
import '../css/common.css'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  componentDidMount() {
    const { dispatch, login } = this.props,
          context = document.getElementById('game')

    const host = 'http://localhost:3000'

    if (!login.user) {
      dispatch(push('/'))
      return
    }

    const game = this.game = new Game({
      host,
      context,
      token: login.token,
      user: login.user
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
      <svg id="game"></svg>
    )
  }
}

export default connect(
  (state) => ({
    login: state.login
  })
)(GamePage)