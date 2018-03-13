import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { routerReducer, routerMiddleware, routerActions } from 'react-router-redux'
import throttle from 'lodash/throttle'
import pick     from 'lodash/pick'

import reducers from './reducers'
import { loadState, saveState } from './local-storage'

export default (history) => {
  let middlewares = [
    thunk,
    routerMiddleware(history)
  ]

  // if (process.env.NODE_ENV !== 'production') {
  //   middlewares.push(logger)
  // }

  const store = createStore(
    combineReducers({
      ...reducers,
      router: routerReducer
    }),
    loadState(),
    applyMiddleware(...middlewares)
  )

  store.subscribe(() => {
    saveState(pick(store.getState(), [
      'login',
      'regions'
    ]))
  })

  return store
}