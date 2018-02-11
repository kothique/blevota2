import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import createStore from './create-store'
import Root from './components/root'

let history = createHistory()
let store = createStore(history)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
