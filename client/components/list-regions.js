import React, { Component } from 'react'
import { string, arrayOf, object } from 'prop-types'

import Region from './region'

import '../styles/list-regions.styl'

class ListRegions extends Component {
  static propTypes = {
    regions: arrayOf(object).isRequired
  }

  render() {
    const { regions } = this.props

    return (
      <ul id="list-regions">
        {regions.map((region) => 
          <li key={region.name}>
            <Region region={region} />
          </li>
        )}
      </ul>
    )
  }
}

export default ListRegions