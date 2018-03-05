import React, { Component } from 'react'
import { string, bool, func, object } from 'prop-types'

import '@client/styles/check-button.styl'

class CheckButton extends Component {
  static propTypes = {
    id: string,
    className: string,
    checked: bool,
    onChange: func,
    attrs: object
  }

  static defaultProps = {
    className: '',
    checked: false
  }

  constructor(props) {
    super(props)

    const { checked } = this.props
    this.state = {
      checked
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.toggle()
    }
  }

  toggle() {
    const { onChange } = this.props

    this.setState((prevState) => ({
      checked: !prevState.checked
    }))
    onChange && window.setImmediate(() => onChange(this.state.checked) )
  }

  render() {
    const { id, className, attrs, children } = this.props
    const { checked } = this.state

    return (
      <button
        id={id}
        className={`check-button ${checked ? 'checked' : ''} ${className}`}
        onClick={this.toggle.bind(this)}
        {...attrs}>

        {children}
      </button>
    )
  }
}

export default CheckButton