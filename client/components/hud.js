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
    skill1: object,
    skill2: object,
    skill3: object,
    skill4: object,
    skill5: object,
    skill6: object,
    skill7: object,
    skill8: object,
    playerMaxHP: number,
    playerHP:    number,
    playerMaxMP: number,
    playerMP:    number,
    chat:        string
  }
   
  static defaultProps = {
    skill1: { type: SkillState.READY },
    skill2: { type: SkillState.READY },
    skill3: { type: SkillState.READY },
    skill4: { type: SkillState.READY },
    skill5: { type: SkillState.READY },
    skill7: { type: SkillState.READY },
    skill8: { type: SkillState.READY },
    playerMaxHP: 0,
    playerHP:    0,
    playerMaxMP: 0,
    playerMP:    0,
    chat:        ''
  }

  render() {
    const { dispatch } = this.props
    const { skill1, skill2, skill3, skill4,
            skill5, skill6, skill7, skill8,
            playerRadius, playerMaxHP, playerHP, playerMaxMP, playerMP,
            chat } = this.props

    return (
      <div id="hud">
        <img id="hud-quit" src="/images/icons/quit.svg"
          onClick={() => dispatch(push('/regions'))} />

        <div id="hud-skill-bar-left">
          <SkillIcon id="hud-skill-1" state={skill1} />
          <SkillIcon id="hud-skill-2" state={skill2} />
          <SkillIcon id="hud-skill-3" state={skill3} />
          <SkillIcon id="hud-skill-4" state={skill4} />
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
          <SkillIcon id="hud-skill-5" state={skill5} />
          <SkillIcon id="hud-skill-6" state={skill6} />
          <SkillIcon id="hud-skill-7" state={skill7} />
          <SkillIcon id="hud-skill-7" state={skill8} />
        </div>
        <div id="hud-chat" dangerouslySetInnerHTML={{ __html: chat }}></div>
      </div>
    )
  }
}

export default connect()(HUD)