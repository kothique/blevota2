import { createStore, combineReducers, applyMiddleware } from 'redux'
import compose from 'redux/src/compose'
import thunk from 'redux-thunk'
import { routerReducer, routerMiddleware, routerActions } from 'react-router-redux'
import logger from 'redux-logger'

import reducers from './reducers'

export default (history) => {
  let middlewares = [
    thunk,
    routerMiddleware(history)
  ]

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger)
  }

  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer
    }),
    applyMiddleware(...middlewares)
  )
}