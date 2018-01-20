import React, { Component, Fragment } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { object, func } from 'prop-types'

import WelcomePage from './WelcomePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { fetchUser } from '../reducers/user'


class Root extends Component {
  static propTypes = {
    store: object.isRequired,
    history: object.isRequired,
    getUser: func.isRequired
  }

  componentDidMount() {
    const { getUser } = this.props

    getUser()
  }

  render() {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Fragment>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
          </Fragment>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    getUser: () => dispatch(fetchUser())
  })
)(Root)