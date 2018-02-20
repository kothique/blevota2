import React, { Component } from 'react'
import { string, arrayOf, object } from 'prop-types'

import Match from './match'

import '../styles/list-matches.styl'

class ListMatches extends Component {
  static propTypes = {
    matches: arrayOf(object).isRequired
  }

  render() {
    const { matches } = this.props

    return (
      <ul id="list-matches">
        {matches.map((match) => 
          <li key={match.id}>
            <Match match={match} />
          </li>
        )}
      </ul>
    )
  }
}

export default ListMatches