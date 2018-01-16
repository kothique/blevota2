import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

// @flow
import App from './App'

type Props = {
  store: Object,
  history: Object
}

class Root extends Component<Props> {
  render() {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={App} />
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default Root