import React, { Component } from 'react'
import { string, func, arrayOf, node } from 'prop-types'

import '../styles/button.styl'

class Button extends Component {
  static propTypes = {
    id: string,
    onClick: func,
    className: string,
    children: arrayOf(node)
  }

  render() {
    const { id, onClick, className, children } = this.props

    return (
      <button
        id={id}
        className={`button ${className || ''}`}
        onClick={onClick}>
       {children}
      </button>
    )
  }
}

export default Button