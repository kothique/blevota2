import React, { Component } from 'react'
import { string, object } from 'prop-types'

import '../styles/button-group.styl'

class ButtonGroup extends Component {
  static propTypes = {
    id: string,
    className: string,
    attrs: object
  }

  render() {
    const { id, className, children, attrs } = this.props

    return (
      <div id={id} className={`button-group ${className || ''}`}
        {...attrs}>
        {children}
      </div>
    )
  }
}

export default ButtonGroup