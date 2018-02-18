import React, { Component } from 'react'
import { string, func, object } from 'prop-types'

import '../styles/button.styl'

class Button extends Component {
  static propTypes = {
    id: string,
    className: string,
    onClick: func,
    type: string,
    attrs: object
  }

  render() {
    const { id, onClick, type, className, children, attrs } = this.props

    return (
      <button
        id={id}
        className={`button ${className || ''}`}
        onClick={onClick}
        type={type}
        {...attrs}>

       {children}
      </button>
    )
  }
}

export default Button