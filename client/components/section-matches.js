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
    token: string,
    allMatches: arrayOf(object),
    isFetching: bool.isRequired,
    filter: object.isRequired,
  }

  static defaultProps = {
    page: 1
  }

  startFetchingMatches(token) {
    const { dispatch } = this.props

    const fetchMatches = () => {
      dispatch(matches(token))
        .catch(() => {})
    }

    if (this.intervalID)
      window.clearInterval(this.intervalID)
    this.intervalID = window.setInterval(fetchMatches, 10000)
    fetchMatches()
  }

  stopFetchingMatches() {
    if (this.intervalID)
      window.clearInterval(this.intervalID)
  }

  componentDidMount() {
    const { token } = this.props

    if (token) {
      this.startFetchingMatches(token)
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, token } = this.props

    if (token && !prevProps.token) {
      this.startFetchingMatches(token)
    } else if (!token && prevProps.token) {
      this.stopFetchingMatches()
    }
  }

  componentWillUnmount() {
    this.stopFetchingMatches()
  }

  render() {
    const { dispatch, page, token,
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
        <div id="smt-controls">
          <FilterMatches />
          <Button
            id="smt-new-match"
            onClick={() => dispatch(newMatch(token))}>
            +
          </Button>
        </div>

        {content}
      </section>
    )
  }
}

export default connect(
  ({ matches, filterMatches, login }) => ({
    error: matches.error,
    allMatches: matches.matches,
    isFetching: matches.isFetching,
    filter: filterMatches,
    token: login.token
  })
)(SectionMatches)