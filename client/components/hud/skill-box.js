/**
 * @module client/components/hud/skill-box
 */

import React, { Component } from 'react'
import { instanceOf }       from 'prop-types'
import { List }             from 'immutable'

import SkillIcon from '@client/components/hud/skill-icon'

import '@client/styles/skill-box.styl'

/** @class */
class SkillBox extends Component {
  static propTypes = {
    skills: instanceOf(List).isRequired
  }

  render() {
    const { skills } = this.props

    return (
      <div id="skill-box">
        {skills.map(({ name, shortcut, state }) => (
          <SkillIcon key={name} state={state} shortcut={shortcut} />
        ))}
      </div>
    )
  }
}

module.exports = SkillBox