import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

const defaultState = {

}

const reducer = (state = defaultState, action) => {
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