import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { func, bool, object, string, node } from 'prop-types'

import { openLoginForm } from '../reducers/modals'
import AnimationLoading from './animation-loading'

import '../styles/access.styl'

class Access extends Component {
  static propTypes = {
    dispatch: func.isRequired,
    users: bool,
    isFetching: bool.isRequired,
    user: object,
    error: string
  }

  static defaultProps = {
    users: false
  }

  render() {
    const { dispatch, isFetching, user, error,
            users, children } = this.props

    let content
    if (isFetching) {
      content = <AnimationLoading />
    } else if (users && !user) {
      content =
        <div id="access-error">
          You have to <a onClick={() => dispatch(openLoginForm())}>login</a> to see this content.
        </div>
    } else if (users && user) {
      content = <Fragment>{children}</Fragment>
    } else if (error) {
      content =
        <div id="access-error">
          Authorization error: {error}
        </div>
    }

    return (
      content
    )
  }
}

export default connect(
  ({ login }) => ({
    isFetching: login.isFetching,
    user: login.user,
    error: login.error,
  })
)(Access)