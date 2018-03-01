import React, { Component, Fragment } from 'react'

import Header from './header'
import MobileMenu from './mobile-menu'
import SectionRegions from './section-regions'
import Footer from './footer'
import Access from './access'

import '../styles/regions-page.styl'

class RegionsPage extends Component {
  render() {
    const page = Number(this.props.match.params.page) || 1

    return (
      <Fragment>
        <Header />
        <MobileMenu />
        <div id="content" className="page-container">
          <Access users>
            <SectionRegions page={page} />
          </Access>
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default RegionsPage