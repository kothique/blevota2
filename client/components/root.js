import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { object } from 'prop-types'

import WelcomePage from './welcome-page'
import GamePage from './game-page'
import RegionsPage from './regions-page'

import '@client/styles/common.styl'

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
          <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/region/:regionName" component={GamePage} />
            <Route path="/regions/:page" component={RegionsPage} />
            <Route path="/regions" component={RegionsPage} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root