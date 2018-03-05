/**
 * @module
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { func, string } from 'prop-types'
import { push } from 'react-router-redux'
import { decode } from 'jsonwebtoken'

import Game from '@client/game'
import Access from './access'
import SkillIcon from './skill-icon'
import AnimationLoading from './animation-loading'
import SkillState from '@common/skill-state'

import '@client/styles/game-page.styl'

/**
 * @class
 */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired
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

  initialize() {
    const { dispatch, match, token, user } = this.props
    const { params: { regionName } } = match,
          context = document.getElementById('gp-game'),
          chat = document.getElementById('gp-chat'),
          host = 'http://localhost:3000'

    const game = this.game = new Game({
      host,
      context,
      chat,
      token,
      user,
      regionName
    })

    game.on('skills', (skills) => {
      this.setState({
        ...skills
      })
    })

    game.on('orb', (orb) => {
      this.setState({
        playerRadius: orb.radius,
        playerMaxHP: orb.maxHp,
        playerHP: orb.hp,
        playerMapMP: orb.maxMp,
        playerMP: orb.mp
      })
    })

    game.on('connect', () => {
      console.log(`Successfully connected to ${host}`)
    })

    game.on('connect_error', (err) => {
      console.log(err.stack)
    })

    game.on('error', (err) => {
      console.log(err.stack)
    })

    game.on('disconnect', () => {
      console.log(`Disconnected from ${host}`)
    })
  }

  deinitialize() {
    if (this.game) {
      this.game.stop()
    }
  }

  componentDidMount() {
    const { user } = this.props

    if (user) {
      this.initialize()
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props

    if (user && !prevProps.user) {
      this.initialize()
    } else if (!user && prevProps.user) {
      this.deinitialize()
    }
  }

  componentWillUnmount() {
    this.deinitialize()
  }

  render() {
    const { dispatch, isFetching, user, error } = this.props
    const { skillA1, skillA2, skillA3, skillA4, skillA5, skillA6,
            skillB1, skillB2, skillB3, skillB4, skillB5, skillB6,
            skillC1, skillC2, skillC3, skillC4, skillC5, skillC6 } = this.state
    const { playerRadius, playerMaxHP, playerHP, playerMaxMP, playerMP } = this.state

    if (isFetching) {
      return (
        <AnimationLoading />
      )
    } else if (!user) {
      return (
        <div id="gp-access-error">
          You can't access this page as a guest. Go to <a onClick={() => dispatch(push('/'))}>main page</a> to login first.
        </div>
      )
    } else if (user) {
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
              fill-opacity={playerMP / playerMaxMP} />
            <circle
              r={`${0.5 * 48}px`} cx="62px" cy="62px"
              fill="rgb(243, 101, 255)"
              fill-opacity={playerHP / playerMaxHP} />
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
    } else if (error) {
      return (
        <div id="gp-access-error">
          Authorization error: {login.error}
        </div>
      )
    }
  }
}

export default connect(
  ({ login }) => ({
    isFetching: login.isFetching,
    user: login.user,
    error: login.error,
    token: login.token
  })
)(GamePage)