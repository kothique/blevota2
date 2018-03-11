import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { routerReducer, routerMiddleware, routerActions } from 'react-router-redux'

import reducers from './reducers'

export default (history) => {
  let middlewares = [
    thunk,
    routerMiddleware(history)
  ]

  // if (process.env.NODE_ENV !== 'production') {
  //   middlewares.push(logger)
  // }

  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer
    }),
    applyMiddleware(...middlewares)
  )
}