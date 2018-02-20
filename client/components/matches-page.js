import React, { Component, Fragment } from 'react'

import Header from './header'
import MobileMenu from './mobile-menu'
import SectionMatches from './section-matches'
import Footer from './footer'

import '../styles/matches-page.styl'

class MatchesPage extends Component {
  render() {
    const page = Number(this.props.match.params.page) || 1

    return (
      <Fragment>
        <Header />
        <MobileMenu />
        <div id="content" className="page-container">
          <SectionMatches page={page} />
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default MatchesPage