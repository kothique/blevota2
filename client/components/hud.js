/**
 * @module client/components/hud
 */

import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { object, number, string } from 'prop-types'

import SkillIcon  from './skill-icon'
import SkillState from '@common/skill-state'

import '@client/styles/hud.styl'

/**
 * @class
 */
class HUD extends Component {
  static propTypes = {
    skillA1: object,
    skillA2: object,
    skillA3: object,
    skillA4: object,
    skillA5: object,
    skillA6: object,
    skillB1: object,
    skillB2: object,
    skillB3: object,
    skillB4: object,
    skillB5: object,
    skillB6: object,
    skillC1: object,
    skillC2: object,
    skillC3: object,
    skillC4: object,
    skillC5: object,
    skillC6: object,
    playerMaxHP: number,
    playerHP:    number,
    playerMaxMP: number,
    playerMP:    number,
    chat:        string
  }
   
  static defaultProps = {
    skillA1: { type: SkillState.READY },
    skillA2: { type: SkillState.READY },
    skillA3: { type: SkillState.READY },
    skillA4: { type: SkillState.READY },
    skillA5: { type: SkillState.READY },
    skillA6: { type: SkillState.READY },
    skillB1: { type: SkillState.READY },
    skillB2: { type: SkillState.READY },
    skillB3: { type: SkillState.READY },
    skillB4: { type: SkillState.READY },
    skillB5: { type: SkillState.READY },
    skillB6: { type: SkillState.READY },
    skillC1: { type: SkillState.READY },
    skillC2: { type: SkillState.READY },
    skillC3: { type: SkillState.READY },
    skillC4: { type: SkillState.READY },
    skillC5: { type: SkillState.READY },
    skillC6: { type: SkillState.READY },
    playerMaxHP: 0,
    playerHP:    0,
    playerMaxMP: 0,
    playerMP:    0,
    chat:        ''
  }

  render() {
    const { dispatch } = this.props
    const { skillA1, skillA2, skillA3, skillA4, skillA5, skillA6,
            skillB1, skillB2, skillB3, skillB4, skillB5, skillB6,
            skillC1, skillC2, skillC3, skillC4, skillC5, skillC6,
            playerRadius, playerMaxHP, playerHP, playerMaxMP, playerMP,
            chat } = this.props

    return (
      <div id="hud">
        <img id="hud-quit" src="/images/icons/quit.svg"
          onClick={() => dispatch(push('/regions'))} />

        <div id="hud-skill-bar-left">
          <SkillIcon id="hud-skill-a1" state={skillA1} />
          <SkillIcon id="hud-skill-a2" state={skillA2} />
          <SkillIcon id="hud-skill-a3" state={skillA3} />
          <SkillIcon id="hud-skill-b1" state={skillB1} />
          <SkillIcon id="hud-skill-b2" state={skillB2} />
          <SkillIcon id="hud-skill-b3" state={skillB3} />
          <SkillIcon id="hud-skill-c1" state={skillC1} />
          <SkillIcon id="hud-skill-c2" state={skillC2} />
          <SkillIcon id="hud-skill-c3" state={skillC3} />
        </div>
        <svg id="hud-orb"
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
        <div id="hud-skill-bar-right">
          <SkillIcon id="hud-skill-a4" state={skillA4} />
          <SkillIcon id="hud-skill-a5" state={skillA5} />
          <SkillIcon id="hud-skill-a6" state={skillA6} />
          <SkillIcon id="hud-skill-b4" state={skillB4} />
          <SkillIcon id="hud-skill-b5" state={skillB5} />
          <SkillIcon id="hud-skill-b6" state={skillB6} />
          <SkillIcon id="hud-skill-c4" state={skillC4} />
          <SkillIcon id="hud-skill-c5" state={skillC5} />
          <SkillIcon id="hud-skill-c6" state={skillC6} />
        </div>
        <div id="hud-chat" dangerouslySetInnerHTML={{ __html: chat }}></div>
      </div>
    )
  }
}

export default connect()(HUD)