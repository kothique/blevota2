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

    if (!login.token) {
      dispatch(push('/'))
      return
    }

    const user = decode(login.token),
          game = this.game = new Game(context, user.id)

    game.onopen = (host) => {
      console.log(`Game: successfully connected to ${host}`)
    }

    game.onerror = (error)  => {
      console.log(`Game: error: ${JSON.stringify(error)}`)
      alert(error)
      dispatch(push('/'))
    }

    game.onclose = ({ code }) => {
      console.log(`Connection closed with code ${code}`)
      dispatch(push('/'))
    }

    game.onmessage = (msg) => {
      console.log(`Message received: `, msg.frame.state.orbs)
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