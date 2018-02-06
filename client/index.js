import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'

/** Run it before any other client code */
process.env.WHERE = 'client'

import createStore from './createStore'
import Root from './components/Root'

let history = createHistory()
let store = createStore(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
