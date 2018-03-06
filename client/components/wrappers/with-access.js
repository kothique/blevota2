/**
 * @module client/components/wrappers/with-access
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { bool, object, string } from 'prop-types'
import { getReactComponentDisplayName } from '@common/util'

import AnimationLoading from '@client/components/animation-loading'

/**
 * Wrapper for components that need specified access rules.
 *
 * @param {object} permissions
 * @param {Node} ifFailure - Rendered when access is forbidden.
 * @return {function}
 */
const withAccess = (permissions = null, ifFailure) => {
  /** @todo permissions is not used yet; only users are allowed by default */

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
  }

  /**
   * @param {Component} WrappedComponent - Rendered when access is granted.
   * @return {object} - Resulting component class.
   */
  return (WrappedComponent) => {
    const Enhance = class extends Component {
      static propTypes = {
        isFetching: bool.isRequired,
        user: object,
        error: string,
        token: string
      }

      static displayName = `WithAccess(${getReactComponentDisplayName(WrappedComponent)})`

      render() {
        const { isFetching, user, error, token, ...rest } = this.props

        /**
         * Fetching.
         */
        if (isFetching) {
          return (
            <AnimationLoading />
          )
        }

        /** Authorized. */
        else if (user) {
          return (
            <WrappedComponent user={user} token={token} {...rest} />
          )
        }

        /** Error or initial state. */
        else {
          return ifFailure
        }
      }
    }

    hoistNonReactStatic(Enhance, WrappedComponent)

    return connect(
      (state) => state.login
    )(Enhance)
  }
}

export default withAccess