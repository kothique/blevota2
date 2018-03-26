/**
 * @module client/components/game-page
 */
import React, { Component, Fragment } from 'react'
import { connect }                    from 'react-redux'
import { func, object, string }       from 'prop-types'
import { push }                       from 'react-router-redux'
import { Map, List }                  from 'immutable'

import Game            from '@client/game'
import HUD             from '@client/components/hud'
import LoginForm       from '@client/components/login-form'
import ModalBackground from '@client/components/modal-background'
import Forbidden       from '@client/components/error/forbidden'
import withAccess      from '@client/components/wrappers/with-access'

import SkillState        from '@common/skill-state'
import { VISION_RADIUS } from '@common/const'

import '@client/styles/game-page.styl'

const HOST = ''

/** @class */
class GamePage extends Component {
  static propTypes = {
    dispatch: func.isRequired,
    user: object.isRequired,
    token: string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      skills: List(),
      bars:   Map(),
      chat:   ''
    }
  }

  onGameSkills = (skills) => {  
    this.setState({ skills })
  }

  onGameOrb = (orb) => {
    const primary   = orb.maxHP === 0 ? 0 : orb.hp / orb.maxHP,
          sMax      = orb.maxStamina || orb.maxMana,
          sValue    = orb.stamina || orb.mana,
          secondary = sMax === 0 ? 0 : sValue / sMax

    this.setState({
      bars: Map({ primary, secondary })
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
      game.end()
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
    const { skills, bars, chat }                = this.state

    return (
      <main id="game-page">
        <svg
          id="gp-game"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${VISION_RADIUS.x * 2} ${VISION_RADIUS.y * 2}`}
          preserveAspectRatio="xMidYMid slice">

          <defs>
            <pattern id="shield-fill" patternContentUnits="objectBoundingBox"
              width="0.2" height="0.2" patternTransform="rotate(45)">

              <line x1="0.1" y="0" x2="0.1" y2="0.2"
                stroke="blue" strokeOpacity="0.2" strokeWidth="0.1" />
            </pattern>

            <pattern id="immunity-fill" patternContentUnits="objectBoundingBox"
              width="0.15" height="0.15" patternTransform="rotate(60)">

              <line x1="0" y="0.01" x2="0.15" y2="0.01" strokeWidth="0.07" stroke="blue" strokeOpacity="0.2" />
              <line x1="0.01" y="0" x2="0.01" y2="0.15" strokeWidth="0.07" stroke="blue" strokeOpacity="0.2" />
            </pattern>

            <radialGradient id="let-loose-gradient" patternContentUnits="objectBoundingBox"
              cx="0.5" cy="0.5" r="0.5">

              <stop offset="0%"   stopColor="rgb(51, 51, 204)" />
              <stop offset="100%" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="hold-on-gradient" patternContentUnits="objectBoundingBox"
              cx="0.5" cy="0.5" r="0.5">

              <stop offset="0%"   stopColor="rgb(174, 17, 31)" />
              <stop offset="100%" stopOpacity="0.2" />
            </radialGradient>

            <pattern id="bg-fill" width="128" height="128" patternUnits="userSpaceOnUse">
              <line x1="128" y1="0" x2="128" y2="128" strokeWidth="3" strokeDasharray="5 5" stroke="rgb(216, 112, 130)" strokeOpacity="0.3" />
              <line x1="0" y1="128" x2="128" y2="128" strokeWidth="3" strokeDasharray="5 5" stroke="rgb(216, 112, 130)" strokeOpacity="0.3" />
            </pattern>
          </defs>
        </svg>

        <div id="gp-bar-top" className="gp-bar"></div>
        <div id="gp-bar-bottom" className="gp-bar"></div>
        <div id="gp-bar-left" className="gp-bar"></div>
        <div id="gp-bar-right" className="gp-bar"></div>

        <HUD skills={skills} bars={bars} chat={chat} />
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