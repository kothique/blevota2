import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func } from 'prop-types'
import { push } from 'react-router-redux'

import Game from '../game'
import './../css/common.css'

class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props

    let game = this.game = new Game

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
      // console.log(`Message received: ${JSON.stringify(msg)}`)
    }

    document.getElementById('game').replaceWith(game.app.view)
  }

  componentWillUnmount() {
    document.getElementById('game').remove()
  }

  render() {
    return (
      <div id="game"></div>
    )
  }
}

export default connect(
  (state) => ({
    user: state.user.user
  })
)(GamePage)