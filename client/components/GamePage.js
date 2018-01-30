import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func } from 'prop-types'
import { push } from 'react-router-redux'

import Game from '../game'
import '../css/GamePage.css'
import '../css/common.css'

class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props

    let game = this.game = new Game(document.getElementById('game'))

    game.onopen = (host) => {
      console.log(`Game: successfully connected to ${host}`)
    }

    game.onerror = (error)  => {
      console.log(`Game: error: ${JSON.stringify(error)}`)
      alert(error)
      dispatch(push('/'))
    }

    game.onclose = (code) => {
      console.log(`Connection closed with code ${code}`)
      dispatch(push('/'))
    }

    game.onmessage = (msg) => {
      // console.log(`Message received: `, msg)
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