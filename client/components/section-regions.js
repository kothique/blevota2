import React, { Component, Fragment } from 'react'
import { number, string, arrayOf, object, bool } from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { regions } from '../reducers/regions'
import AnimationLoading from './animation-loading'
import ListRegions from './list-regions'
import Pagination from './pagination'
import Button from './button'
import Label from './label'

import '../styles/section-regions.styl'

const pageSize = 10

class SectionRegions extends Component {
  static propTypes = {
    page: number,
    error: string,
    token: string,
    allRegions: arrayOf(object),
    isFetching: bool.isRequired
  }

  static defaultProps = {
    page: 1
  }

  startFetchingRegions(token) {
    const { dispatch } = this.props

    const fetchRegions = () => {
      dispatch(regions(token))
        .catch(() => {})
    }

    if (this.intervalID)
      window.clearInterval(this.intervalID)
    this.intervalID = window.setInterval(fetchRegions, 10000)
    fetchRegions()
  }

  stopFetchingRegions() {
    if (this.intervalID)
      window.clearInterval(this.intervalID)
  }

  componentDidMount() {
    const { token } = this.props

    if (token) {
      this.startFetchingRegions(token)
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, token } = this.props

    if (token && !prevProps.token) {
      this.startFetchingRegions(token)
    } else if (!token && prevProps.token) {
      this.stopFetchingRegions()
    }
  }

  componentWillUnmount() {
    this.stopFetchingRegions()
  }

  render() {
    const { dispatch, page, token,
            error, isFetching, allRegions } = this.props

    let content
    if (error) {
      content = <Label id="smt-error">{error}</Label>
    } else if (allRegions) {
      const pages = Math.ceil(allRegions.length / pageSize),
            regions = allRegions.slice((page - 1) * pageSize, page * pageSize)

      const pagination = pages > 1
        ? <Pagination id="smt-pagination"
            start={1} end={pages} page={page}
            onChange={page => dispatch(push(`/regions/${page}`))} />
        : ''

      content =
        <Fragment>
          <ListRegions regions={regions} />
          {pagination}
        </Fragment>
    } else if (isFetching) {
      content = <AnimationLoading />
    }

    return (
      <section id="smt-section">
        {content}
      </section>
    )
  }
}

export default connect(
  ({ regions, login }) => ({
    error: regions.error,
    allRegions: regions.regions,
    isFetching: regions.isFetching,
    token: login.token
  })
)(SectionRegions)