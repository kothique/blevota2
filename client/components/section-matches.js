import React, { Component, Fragment } from 'react'
import { number, string, arrayOf, object, bool } from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { matches } from '../reducers/matches'
import { newMatch } from '../reducers/new-match'
import AnimationLoading from './animation-loading'
import FilterMatches from './filter-matches'
import ListMatches from './list-matches'
import Pagination from './pagination'
import Button from './button'
import Label from './label'

import '../styles/section-matches.styl'

const pageSize = 10

class SectionMatches extends Component {
  static propTypes = {
    page: number,
    error: string,
    allMatches: arrayOf(object),
    isFetching: bool.isRequired,
    filter: object.isRequired
  }

  static defaultProps = {
    page: 1
  }

  componentDidMount() {
    const { dispatch } = this.props

    const getMatches = () => {
      dispatch(matches())
        .catch(() => {})
    }

    this.intervalID = window.setInterval(getMatches, 10000)
    getMatches()
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalID)
  }

  render() {
    const { dispatch, page,
            error, isFetching, allMatches, filter } = this.props

    let content
    if (error) {
      content = <Label id="smt-error">{error}</Label>
    } else if (allMatches) {
      let matches = allMatches.filter((match) =>
        filter.running && match.state === 'running' ||
        filter.open    && match.state === 'open'
      )

      const pages = Math.ceil(matches.length / pageSize)
      matches = matches.slice((page - 1) * pageSize, page * pageSize)

      const pagination = pages > 1
        ? <Pagination id="smt-pagination"
            start={1} end={pages} page={page}
            onChange={page => dispatch(push(`/matches/${page}`))} />
        : ''

      content =
        <Fragment>
          <ListMatches matches={matches} />
          {pagination}
        </Fragment>
    } else if (isFetching) {
      content = <AnimationLoading />
    }

    return (
      <section id="smt-section">
        <Fragment>
          <div id="smt-controls">
            <FilterMatches />
            <Button
              id="smt-new-match"
              onClick={() => dispatch(newMatch())}>
              +
            </Button>
          </div>

          {content}
        </Fragment>
      </section>
    )
  }
}

export default connect(
  ({ matches, filterMatches }) => ({
    error: matches.error,
    allMatches: matches.matches,
    isFetching: matches.isFetching,
    filter: filterMatches
  })
)(SectionMatches)