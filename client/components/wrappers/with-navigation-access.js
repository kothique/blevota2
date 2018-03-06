/**
 * @module client/components/wrappers/with-navigation-access
 */

import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

import Forbidden      from '@client/components/error/forbidden'
import withNavigation from '@client/components/wrappers/with-navigation'
import withAccess     from '@client/components/wrappers/with-access'

import { getReactComponentDisplayName } from '@common/util'

/**
 * @param {?object} permissions
 * @return {function}
 */
const withNavigationAccess = (permissions = undefined) =>
  /**
   * @param {Component} WrappedComponent
   * @return {Component}
   */
  (WrappedComponent) => {
    const Enhance = withNavigation()(
        withAccess(permissions, <Forbidden />)(
          WrappedComponent
      )
    )
    Enhance.displayName = `WithNavigationAccess(${getReactComponentDisplayName(WrappedComponent)})`

    hoistNonReactStatic(Enhance, WrappedComponent)

    return Enhance
  }

export default withNavigationAccess