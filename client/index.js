import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// @flow
import App from './ui/App'

type State = {
  greeting: string
}

const defaultState: State = {
  greeting: 'Hi here!'
}

// action type
const // TODO...

let store = createStore((state: State = defaultState, action) => {
  switch (action.type) {
  default:
    return state
  }
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
