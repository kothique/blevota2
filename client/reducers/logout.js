import axios from 'axios'

import { fetchUser } from './user'

const defaultState = { isFetching: false,
  error: undefined
}

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT'
const requestLogout = () => ({
  type: REQUEST_LOGOUT
})

export const SUCCESS_LOGOUT = 'SUCCESS_LOGOUT'
const successLogout = () => ({
  type: SUCCESS_LOGOUT
})

export const FAILURE_LOGOUT = 'FAILURE_LOGOUT'
const failureLogout = (error) => ({
  type: FAILURE_LOGOUT,
  error
})

export const logoutReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_LOGOUT:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_LOGOUT:
      return {
        ...state,
        isFetching: false,
        error: undefined
      }
    case FAILURE_LOGOUT:
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    default:
      return state
  }
}

export const logout = () => (dispatch) => {
  dispatch(requestLogout())

  return axios.post('/api/logout')
    .then(
      () => {
        dispatch(successLogout())
        dispatch(fetchUser())
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error

          dispatch(failureLogout(message))
          dispatch(fetchUser())

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}