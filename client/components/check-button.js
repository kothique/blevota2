import React, { Component } from 'react'
import { string, bool, func, object } from 'prop-types'

import '../styles/check-button.styl'

class CheckButton extends Component {
  static propTypes = {
    id: string,
    className: string,
    checked: bool,
    onChange: func,
    attrs: object
  }

  constructor(props) {
    super(props)

    this.state = {
      checked: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { checked } = this.state

    if (nextProps.checked !== checked) {
      this.toggle()
    }
  }

  toggle() {
    const { onChange } = this.props

    this.setState({ checked: !this.state.checked })
    onChange(this.state.checked)
  }

  render() {
    const { id, className, attrs, children } = this.props
    const { checked } = this.state

    return (
      <button
        id={id}
        className={`check-button ${checked ? 'checked' : ''} ${className || ''}`}
        onClick={this.toggle.bind(this)}
        {...attrs}>

        {children}
      </button>
    )
  }
}

export default CheckButton