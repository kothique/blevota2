/**
 * @module
 */

import React, { Component, Fragment } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'

import Header          from '@client/components/header'
import MobileMenu      from '@client/components/mobile-menu'
import Footer          from '@client/components/footer'
import LoginForm       from '@client/components/login-form'
import RegisterForm    from '@client/components/register-form'
import ModalBackground from '@client/components/modal-background'
import { getReactComponentDisplayName } from '@common/util'

/**
 * Wrapper that adds header, footer and, mobile menu.
 *
 * @return {function}
 */
const withNavigation = () => {
  return (WrappedComponent) => {
    const Enhance = class extends Component {
      static displayName = `WithNavigation(${getReactComponentDisplayName(WrappedComponent)})`

      render() {
        return (
          <Fragment>
            <Header />
            <MobileMenu />
            <div id="content" className="page-container">
              <WrappedComponent {...this.props} />
            </div>
            <Footer />

            <LoginForm />
            <RegisterForm />
            <ModalBackground />
          </Fragment>
        )
      }
    }

    hoistNonReactStatic(Enhance, WrappedComponent)

    return Enhance
  }
}

export default withNavigation