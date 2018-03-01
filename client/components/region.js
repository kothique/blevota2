import React, { Component } from 'react'
import { string, object } from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Button from './button'
import '../styles/region.styl'

class Region extends Component {
  static propTypes = {
    region: object.isRequired
  }

  render() {
    const { dispatch, region } = this.props
    const { name, players } = region

    return (
      <div className="region">
        <div className="region-content">
          <span className="region-name">
            {name}
          </span>
          <ul className="region-players">
            players: {players.length}
          </ul>
        </div>

        <div className="region-controls">
          <Button
            className="region-join"
            onClick={() => dispatch(push(`/region/${name}`))}>

            JOIN
          </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Region)