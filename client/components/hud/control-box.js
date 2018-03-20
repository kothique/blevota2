/**
 * @module client/components/hud/controls-box
 */

import React, { Component } from 'react'

import QuitButton from './quit-button'

/** @class */
class ControlBox extends Component {
  render() {
    return (
      <div id="control-box">
        <QuitButton />
      </div>
    )
  }
}

export default ControlBox