import React, { Component, Fragment } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { object } from 'prop-types'

import WelcomePage from './welcome-page'
import RegisterPage from './register-page'
import GamePage from './game-page'

import '../styles/common.styl'

class Root extends Component {
  static propTypes = {
    store: object.isRequired,
    history: object.isRequired
  }

  render() {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Fragment>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/match/:matchId" component={GamePage} />
          </Fragment>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root
