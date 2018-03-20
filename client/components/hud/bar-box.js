/**
 * @module client/components/hud/bar-box
 */

import React, { Component }           from 'react'
import { instanceOf, number, string } from 'prop-types'
import { Map }                        from 'immutable'

import '@client/styles/bar-box.styl'

/** @class */
class Bar extends Component {
  static propTypes = {
    value: number.isRequired,
    color: string
  }

  render() {
    const { value, color } = this.props,
          style = {
            backgroundColor: color,
            height: `${value * 100}%`
          }

    return (
      <div style={style} className="bb-bar"></div>
    )
  }
}

/** @class */
class BarBox extends Component {
  static propTypes = {
    bars: instanceOf(Map).isRequired
  }

  render() {
    const { bars } = this.props

    const primary   = bars.get('primary')   || 0,
          secondary = bars.get('secondary') || 0

    return (
      <div id="bar-box">
        <Bar color="rgb(174, 17, 31)"    value={primary} />
        <Bar color="rgb(245, 200, 14)" value={secondary} />
      </div>
    )
  }
}

export default BarBox