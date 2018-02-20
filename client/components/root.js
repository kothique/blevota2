import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { object } from 'prop-types'

import WelcomePage from './welcome-page'
import GamePage from './game-page'
import MatchesPage from './matches-page'

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
          <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/match/:matchId" component={GamePage} />
            <Route path="/matches/:page" component={MatchesPage} />
            <Route path="/matches" component={MatchesPage} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root
