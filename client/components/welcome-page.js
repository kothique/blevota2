import React, { Component, Fragment } from 'react'

import Header from './header'
import MobileMenu from './mobile-menu'
import SectionMain from './section-main'
import Footer from './footer'

import '@client/styles/welcome-page.styl'

class WelcomePage extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <MobileMenu />
        <div id="content">
          <SectionMain />
        </div>
        <Footer />
      </Fragment>
    )
  }
}
export default WelcomePage