import React, { Component, Fragment } from 'react'
import { string } from 'prop-types'

import SectionRegions       from './section-regions'
import withNavigationAccess from '@client/components/wrappers/with-navigation-access'

import '@client/styles/regions-page.styl'

class RegionsPage extends Component {
  static propTypes = {
    token: string.isRequired
  }

  render() {
    const { token, match } = this.props,
          page = Number(match.params.page) || 1

    return (
      <Fragment>
        <SectionRegions page={page} token={token} />
      </Fragment>
    )
  }
}

export default withNavigationAccess()(RegionsPage)