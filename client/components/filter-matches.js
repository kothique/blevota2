import React, { Component } from 'react'
import { string } from 'prop-types'
import { connect } from 'react-redux'

import { setFilterMatches } from '../reducers/filter-matches'
import ButtonGroup from './button-group'
import CheckButton from './check-button'

import '../styles/filter-matches.styl'

class FilterMatches extends Component {
  static propTypes = {
    id: string,
    className: string
  }

  render() {
    const { dispatch, filter } = this.props

    return (
      <ButtonGroup id="filter-matches">
        <CheckButton
          onChange={(running) => dispatch(setFilterMatches({ running }))}
          checked={filter.running}>

          RUNNING
        </CheckButton>

        <CheckButton
          onChange={(open) => dispatch(setFilterMatches({ open }))}
          checked={filter.open}>

          OPEN
        </CheckButton>
      </ButtonGroup>
    )
  }
}

export default connect(
  ({ filterMatches }) => ({
    filter: filterMatches
  })
)(FilterMatches)