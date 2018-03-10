import React, { Component } from 'react'
import { shape, number, any, string } from 'prop-types'

import SkillState from '@common/skill-state'
import '@client/styles/skill-icon.styl'

class SkillIcon extends Component {
  static propTypes = {
    id: string,
    state: shape({
      type:  number.isRequired,
      value: any
    }),
    img: string,
    shortcut: string
  }

  static defaultProps = {
    state: {
      type: SkillState.READY
    }
  }

  render() {
    const { id, state, img, shortcut } = this.props

    const icon = img
      ? <img className="si-img" src={img} />
      : ''

    let className = 'skill-icon'
    if (state.type === SkillState.READY) {
      className += ' ready'
    } else if (state.type === SkillState.ACTIVE) {
      className += ' active'
    } else if (state.type === SkillState.NO_MANA) {
      className += ' no-mana'
    } else if (state.type === SkillState.COOLDOWN) {
      className += ' cooldown'
    }

    return (
      <div id={id} className={className}>
        <div className="si-time"></div>
        <div className="si-panel"></div>
        {icon}
        {shortcut ? <div className="si-shortcut">{shortcut}</div> : ''}
      </div>
    )
  }
}

export default SkillIcon