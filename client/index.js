import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import createStore from './createStore'

// @flow
import Root from './components/Root'

let history = createHistory()
let store = createStore(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
