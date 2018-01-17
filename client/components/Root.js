import React, { Component, Fragment } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { object } from 'prop-types'

import WelcomePage from './WelcomePage'
import LoginPage from './LoginPage'
//import RegistrationPage from './RegistrationPage'

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
            <Route path="/login" component={LoginPage} />
          </Fragment>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root