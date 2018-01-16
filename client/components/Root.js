import React, { Component } from 'react'
import { Provider } from 'react-redux'

// @flow
import App from './App'

type Props = {
  store: Object
}

class Root extends Component<Props> {
  render = () =>
    <Provider store={this.props.store}>
      <App />
    </Provider>
}

export default Root