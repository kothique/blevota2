/**
 * @module client/components/modal-background
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import '@client/styles/modal-background.styl'

/**
 * @class
 */
class ModalBackground extends Component {
  /**
   * Render the half-transparent background if any modal form is open.
   */
  render() {
    const { open } = this.props

    return (
      <div id="modal-background" className={open ? 'open' : ''}></div>
    )
  }
}

export default connect(
  (state) => ({
    open: state.modals.openModal !== null
  })
)(ModalBackground)