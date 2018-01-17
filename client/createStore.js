import { createStore, combineReducers, applyMiddleware } from 'redux'
import compose from 'redux/src/compose'
import thunk from 'redux-thunk'
import { routerReducer, routerMiddleware, routerActions } from 'react-router-redux'

import reducers from './reducers'

export default (history) => createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  applyMiddleware(
    thunk,
    routerMiddleware(history)
  )
)