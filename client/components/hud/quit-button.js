/**
 * @module client/components/hud/quit-button
 */

import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { push }             from 'react-router-redux'

import '@client/styles/quit-button.styl'

/** @class */
class QuitButton extends Component {
  render() {
    return (
      <img id="quit-button" src="/images/icons/quit.svg"
        onClick={() => this.props.dispatch(push('/regions'))} />
    )
  }
}

export default connect()(QuitButton)