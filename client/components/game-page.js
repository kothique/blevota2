/**
 * @module client/components/game-page
 */
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { func, object, string } from 'prop-types'
import { push } from 'react-router-redux'

import Game            from '@client/game'
import HUD             from '@client/components/hud'
import LoginForm       from '@client/components/login-form'
import ModalBackground from '@client/components/modal-background'
import Forbidden       from '@client/components/error/forbidden'
import withAccess      from '@client/components/wrappers/with-access'
import SkillState      from '@common/skill-state'

import '@client/styles/game-page.styl'

const HOST = 'http://localhost:3000/'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired,
    user: object.isRequired,
    token: string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      chat: '',
      skillA1: {
        type: SkillState.READY
      },
      skillA2: {
        type: SkillState.READY
      }
    }
  }

  onGameSkills = (skills) => {  
    this.setState(skills)
  }

  onGameOrb = (orb) => {
    this.setState({
      playerMaxHP: orb.maxHp,
      playerHP: orb.hp,
      playerMapMP: orb.maxMp,
      playerMP: orb.mp
    })
  }

  onGameEvent = (text) => {
    this.setState((prevState) => ({
      chat: prevState.chat + text
    }))
  }

  onGameConnect = () => {
    console.log(`Successfully connected to ${HOST}`)
  }

  onGameConnectError = (err) => {
    console.log(`Failed to connect to ${HOST}:`)
    console.log(err.stack)
    this.props.dispatch(push('/regions'))
  }

  onGameError = (err) => {
    console.log(err.stack)
    this.props.dispatch(push('/regions'))
  }

  onGameDisconnect = () => {
    console.log(`Disconnected from ${HOST}`)
  }

  componentDidMount() {
    const { dispatch, match, token, user } = this.props
    const { params: { regionName } } = match,
          svg = document.getElementById('gp-game')

    const game = this.game = new Game({
      host: HOST,
      svg, token, user, regionName
    })

    game.on('skills', this.onGameSkills)
    game.on('orb', this.onGameOrb)
    game.on('event', this.onGameEvent)
    game.on('connect', this.onGameConnect)
    game.on('connect_error', this.onGameConnectError)
    game.on('error', this.onGameError)
    game.on('disconnect', this.onGameDisconnect)
  }

  componentWillUnmount() {
    const game = this.game

    if (game) {
      game.stop()
      game.removeListener('skills', this.onGameSkills)
      game.removeListener('orb', this.onGameOrb)
      game.removeListener('connect', this.onGameConnect)
      game.removeListener('connect_error', this.onGameConnectError)
      game.removeListener('error', this.onGameError)
      game.removeListener('disconnect', this.onGameDisconnect)
    }
  }

  render() {
    const { dispatch, isFetching, user, error } = this.props

    return (
      <main id="game-page">
        <svg
          id="gp-game"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1366 768"
          preserveAspectRatio="xMidYMin meet">
        </svg>
        <div id="gp-bar-top" className="gp-bar"></div>
        <div id="gp-bar-bottom" className="gp-bar"></div>
        <div id="gp-bar-left" className="gp-bar"></div>
        <div id="gp-bar-right" className="gp-bar"></div>
        <HUD {...this.state} />
      </main>
    )
  }
}

export default withAccess(
  null,
  <Fragment>
    <LoginForm />
    <ModalBackground />
    <Forbidden />
  </Fragment>
)(connect()(GamePage))