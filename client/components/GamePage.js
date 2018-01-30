import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func } from 'prop-types'
import { push } from 'react-router-redux'

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
    const { dispatch, user } = this.props,
          context = document.getElementById('game')

    if (!user) {
      dispatch(push('/'))
      return
    }

    let game = this.game = new Game(context, user._id)

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
    user: state.user.user
  })
)(GamePage)