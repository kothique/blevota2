/**
 * @module
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import '@client/styles/forbidden.styl'

/**
 * @class
 *
 * Like {@link module:client/components/error/forbidden~Forbidden},
 * but intended to use with
 * {@link module:client/components/game-page~GamePage}.
 */
class ForbiddenGame extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <div id="forbidden">
        You need to go to <a onClick={() => dispatch(push('/'))}>main page</a> to login first.
      </div>
    )
  }
}

export default connect()(ForbiddenGame)