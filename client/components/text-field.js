import React, { Component } from 'react'
import { string, func, object } from 'prop-types'

import '@client/styles/text-field.styl'

class TextField extends Component {
  static propTypes = {
    id: string,
    className: string,
    type: string,
    value: string,
    onChange: func,
    inputRef: func,
    attrs: object
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, type, value, onChange, inputRef,
            attrs, children } = this.props

    return (
      <input
        id={id}
        className={`text-field ${className}`}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        ref={inputRef}
        {...attrs}>

        {children}
      </input>
    )
  }
}

export default TextField