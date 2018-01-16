import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

// @flow
type State = {
  greeting: string
}

type Action = {
  type: string
}

const defaultState: State = {
  greeting: 'Hi there!'
}

const reducer = (state: State = defaultState, action: Action): State => {
  switch (action.type) {
  default:
    return state
  }
}

export default history => createStore(
  combineReducers({
    app: reducer,
    router: routerReducer
  }),
  {
    app: defaultState
  },
  applyMiddleware(routerMiddleware(history)),
)