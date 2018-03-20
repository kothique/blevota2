/**
 * @module client/components/hud/chat-box
 */

import React, { Component } from 'react'
import { string }           from 'prop-types'

import '@client/styles/chat-box.styl'

class ChatBox extends Component {
  static propTypes = {
    chat: string.isRequired
  }

  render() {
    const { chat } = this.props

    return (
      <div id="chat-box" dangerouslySetInnerHTML={{ __html: chat }}></div>
    )
  }
}

export default ChatBox