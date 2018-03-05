import React, { Component, Fragment } from 'react'

import SectionMain from './section-main'
import withNavigation from './wrappers/with-navigation'

import '@client/styles/welcome-page.styl'

class WelcomePage extends Component {
  render() {
    return (
      <Fragment>
          <SectionMain />
      </Fragment>
    )
  }
}

export default withNavigation()(WelcomePage)