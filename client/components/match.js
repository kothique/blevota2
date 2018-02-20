import React, { Component } from 'react'
import { string, object } from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Button from './button'
import '../styles/match.styl'

class Match extends Component {
  static propTypes = {
    match: object.isRequired
  }

  render() {
    const { dispatch, match } = this.props
    const { id, state, players, createdAt } = match

    let button = ''
    if (state === 'running') {
      button =
        <Button
          className="match-watch"
          onClick={() => dispatch(push(`/watch/${id}`))}>

          WATCH
        </Button>
    } else if (state === 'open') {
      button =
        <Button
          className="match-join"
          onClick={() => dispatch(push(`/match/${id}`))}>

          JOIN
        </Button>
    }

    const difference = Date.now() - createdAt,
          hours = Math.floor(difference / 1000 / 60 / 60),
          minutes = Math.floor(difference / 1000 / 60 % 60)


    return (
      <div className="match">
        <div className="match-content">
          <span className="match-id">
            {id}
          </span>
          <span className="match-time">
            {state} for {hours} hours {minutes} minutes
          </span>
          <ul className="match-list-players">
            {players.map((player) =>
              <li className="match-player" key={player.id}>
                {player.username}
              </li>
            )}
          </ul>
        </div>

        <div className="match-controls">
          {button}
        </div>
      </div>
    )
  }
}

export default connect()(Match)