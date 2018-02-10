import axios from 'axios'

const defaultState = {
  isFetching: false,
  error: undefined
}

export const REQUEST_REGISTER = 'REQUEST_REGISTER'
const requestRegister = () => ({
  type: REQUEST_REGISTER
})

export const SUCCESS_REGISTER = 'SUCCESS_REGISTER'
const successRegister = () => ({
  type: SUCCESS_REGISTER,
})

export const FAILURE_REGISTER = 'FAILURE_REGISTER'
const failureRegister = (error) => ({
  type: FAILURE_REGISTER,
  error
})

export const registerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_REGISTER:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_REGISTER:
      return {
        ...state,
        isFetching: false,
        error: undefined
      }
    case FAILURE_REGISTER:
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    default:
      return state
  }
}

export const register =
(username, password, passwordRepeated) => (dispatch) => {
  dispatch(requestRegister())

  if (password !== passwordRepeated) {
    dispatch(failureRegister('Passwords do not match'))
    return
  }

  const data = {
    username,
    password
  }

  return axios.post('/api/register', data)
    .then(
      () => {
        dispatch(successRegister())
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error
          dispatch(failureRegister(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}