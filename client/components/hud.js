/**
 * @module client/components/hud
 */

import React, { Component }   from 'react'
import { string, instanceOf } from 'prop-types'
import { Map, List }          from 'immutable'

import ControlBox from '@client/components/hud/control-box'
import ChatBox    from '@client/components/hud/chat-box'
import BarBox     from '@client/components/hud/bar-box'
import SkillBox   from '@client/components/hud/skill-box'

/** @class */
class HUD extends Component {
  static propTypes = {
    skills: instanceOf(List).isRequired,
    bars:   instanceOf(Map).isRequired,
    chat:   string.isRequired
  }

  render() {
    const { skills, bars, chat } = this.props

    return (
      <div id="hud" className="unselectable">
        <ControlBox />
        <ChatBox chat={chat} />

        <BarBox bars={bars} />
        <SkillBox skills={skills} />
      </div>
    )
  }
}

export default HUD