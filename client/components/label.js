import React, { Component } from 'react'
import { string, object } from 'prop-types'

import '@client/styles/label.styl'
import { differenceInDays } from 'date-fns';

class Label extends Component {
  static propTypes = {
    id: string,
    className: string,
    attrs: object
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { id, className, attrs, children } = this.props

    return (
      <div
        id={id}
        className={`label ${className}`}
        {...attrs}>

        {children}
      </div>
    )
  }
}

export default Label