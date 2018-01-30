import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import createStore from './createStore'
import Root from './components/Root'
import '../common/util'

let history = createHistory()
let store = createStore(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
