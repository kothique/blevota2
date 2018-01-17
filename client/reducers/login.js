import axios from 'axios'

const defaultState = {
  isFetching: false,
  error: undefined
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
const requestLogin = (username, password) => ({
  type: REQUEST_LOGIN,
  username,
  password
})

export const SUCCESS_LOGIN = 'SUCCESS_LOGIN'
const successLogin = () => ({
  type: SUCCESS_LOGIN,
})

export const FAILURE_LOGIN = 'FAILURE_LOGIN'
const failureLogin = (error) => ({
  type: FAILURE_LOGIN,
  error
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
        error: undefined
      }
    case FAILURE_LOGIN:
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
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
      () => {
        dispatch(successLogin())
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