/**
 * @module
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func, object, string } from 'prop-types'
import { push } from 'react-router-redux'

import SkillIcon     from './skill-icon'
import Game          from '@client/game'
import ForbiddenGame from '@client/components/error/forbidden-game'
import withAccess    from '@client/components/wrappers/with-access'
import SkillState    from '@common/skill-state'

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
      skillA1: {
        type: SkillState.READY
      },
      skillA2: {
        type: SkillState.READY
      }
    }
  }

  onGameSkills = (skills) => {  
    this.setState({
      ...skills
    })
  }

  onGameOrb = (orb) => {
    this.setState({
      playerRadius: orb.radius,
      playerMaxHP: orb.maxHp,
      playerHP: orb.hp,
      playerMapMP: orb.maxMp,
      playerMP: orb.mp
    })
  }

  onGameConnect = () => {
    console.log(`Successfully connected to ${HOST}`)
  }

  onGameConnectError = (err) => {
    console.log(err.stack)
  }

  onGameError = (err) => {
    console.log(err.stack)
  }

  onGameDisconnect = () => {
    console.log(`Disconnected from ${HOST}`)
  }

  componentDidMount() {
    const { dispatch, match, token, user } = this.props
    const { params: { regionName } } = match,
          context = document.getElementById('gp-game'),
          chat = document.getElementById('gp-chat')

    const game = this.game = new Game({
      host: HOST,
      context,
      chat,
      token,
      user,
      regionName
    })

    game.on('skills', this.onGameSkills)
    game.on('orb', this.onGameOrb)
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
    const { skillA1, skillA2, skillA3, skillA4, skillA5, skillA6,
            skillB1, skillB2, skillB3, skillB4, skillB5, skillB6,
            skillC1, skillC2, skillC3, skillC4, skillC5, skillC6 } = this.state
    const { playerRadius, playerMaxHP, playerHP, playerMaxMP, playerMP } = this.state

    return (
      <main id="game-page">
        <svg
          id="gp-game"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg">
        </svg>

        <img id="gp-quit" src="/images/icons/quit.svg"
          onClick={() => dispatch(push('/regions'))} />

        <div id="gp-skill-bar-left">
          <SkillIcon id="gp-skill-a1" state={skillA1} />
          <SkillIcon id="gp-skill-a2" state={skillA2} />
          <SkillIcon id="gp-skill-a3" state={skillA3} />
          <SkillIcon id="gp-skill-b1" state={skillB1} />
          <SkillIcon id="gp-skill-b2" state={skillB2} />
          <SkillIcon id="gp-skill-b3" state={skillB3} />
          <SkillIcon id="gp-skill-c1" state={skillC1} />
          <SkillIcon id="gp-skill-c2" state={skillC2} />
          <SkillIcon id="gp-skill-c3" state={skillC3} />
        </div>
        <svg id="gp-orb"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg">

          <circle
            r="48px" cx="62px" cy="62px"
            fill="rgb(0, 101, 255)" />
          <circle
            r={`${0.8 * 48}px`} cx="62px" cy="62px"
            fill="rgb(0, 218, 255)"
            fillOpacity={playerMP / playerMaxMP || 1} />
          <circle
            r={`${0.5 * 48}px`} cx="62px" cy="62px"
            fill="rgb(243, 101, 255)"
            fillOpacity={playerHP / playerMaxHP || 1} />
        </svg>
        <div id="gp-skill-bar-right">
          <SkillIcon id="gp-skill-a4" state={skillA4} />
          <SkillIcon id="gp-skill-a5" state={skillA5} />
          <SkillIcon id="gp-skill-a6" state={skillA6} />
          <SkillIcon id="gp-skill-b4" state={skillB4} />
          <SkillIcon id="gp-skill-b5" state={skillB5} />
          <SkillIcon id="gp-skill-b6" state={skillB6} />
          <SkillIcon id="gp-skill-c4" state={skillC4} />
          <SkillIcon id="gp-skill-c5" state={skillC5} />
          <SkillIcon id="gp-skill-c6" state={skillC6} />
        </div>
        <div id="gp-chat"></div>
      </main>
    )
  }
}

export default withAccess(
  null,
  <ForbiddenGame />
)(connect()(GamePage))