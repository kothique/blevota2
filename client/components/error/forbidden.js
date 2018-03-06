/**
 * @module client/components/error/forbidden
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { openLoginForm } from '@client/reducers/modals'

import '@client/styles/forbidden.styl'

/**
 * @class
 */
class Forbidden extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <div id="forbidden">
        You have to <a onClick={() => dispatch(openLoginForm())}>login</a> to see this page.
      </div>
    )
  }
}

export default connect()(Forbidden)