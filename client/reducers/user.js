import axios from 'axios'

const defaultState = {
  isFetching: false,
  user: undefined
}

export const REQUEST_USER = 'REQUEST_USER'
const requestUser = () => ({
  type: REQUEST_USER
})

export const SUCCESS_USER = 'SUCCESS_USER'
const successUser = (user) => ({
  type: SUCCESS_USER,
  user
})

export const FAILURE_USER = 'FAILURE_USER'
const failureUser = (error) => ({
  type: FAILURE_USER,
  error
})

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_USER:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_USER:
      return {
        ...state,
        isFetching: false,
        user: action.user,
        error: undefined
      }
    case FAILURE_USER:
      return {
        ...state,
        isFetching: false,
        user: undefined,
        error: action.error
      }
    default:
      return state
  }
}

export const fetchUser = () => (dispatch) => {
  dispatch(requestUser())

  return axios('/api/user')
    .then(
      (json) => {
        dispatch(successUser(json.data))
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error

          dispatch(failureUser(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
    .catch((error) => {
      console.log(`Failure fetching user: ${error.message}`)
    })
}
