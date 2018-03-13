/**
 * @module client/game/components/not-found-page
 */
import React, { Component } from 'react'

import withNavigation from '@client/components/wrappers/with-navigation'

import '@client/styles/not-found-page.styl'

/**
 * @class
 */
class NotFoundPage extends Component {
  render() {
    return (
      <div id="not-found">Page Not Found</div>
    )
  }
}

export default withNavigation()(NotFoundPage)