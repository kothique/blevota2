import axios from 'axios'
import { decode } from 'jsonwebtoken'

const defaultState = {
  isFetching: false,
  error: undefined,
  user: undefined,
  token: undefined
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
const requestLogin = () => ({
  type: REQUEST_LOGIN
})

export const SUCCESS_LOGIN = 'SUCCESS_LOGIN'
const successLogin = (token) => ({
  type: SUCCESS_LOGIN,
  token
})

export const FAILURE_LOGIN = 'FAILURE_LOGIN'
const failureLogin = (error) => ({
  type: FAILURE_LOGIN,
  error
})

export const INVALIDATE_LOGIN = 'INVALIDATE_LOGIN'
const invalidateLogin = () => ({
  type: INVALIDATE_LOGIN
})

export const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_LOGIN:
      return {
        ...state,
        isFetching: false,
        error: undefined,
        token: action.token,
        user: decode(action.token)
      }
    case FAILURE_LOGIN:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        token: undefined,
        user: undefined
      }
    case INVALIDATE_LOGIN:
      return defaultState
    default:
      return state
  }
}

export const login = (username, password) => (dispatch) => {
  dispatch(requestLogin())

  const data = {
    username,
    password
  }

  return axios.post('/api/login', data)
    .then(
      ({ data: { token } }) => {
        dispatch(successLogin(token))
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error

          dispatch(failureLogin(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}

export const logout = invalidateLogin