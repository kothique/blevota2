import axios from 'axios'
import { REQUEST_LOGIN } from './login';

const defaultState = {
  isFetching: false,
  error: undefined,
  matches: []
}

export const REQUEST_MATCHES = 'REQUEST_MATCHES'
const requestMatches = () => ({
  type: REQUEST_MATCHES
})

export const SUCCESS_MATCHES = 'SUCCESS_MATCHES'
const successMatches = (matches) => ({
  type: SUCCESS_MATCHES,
  matches
})

export const FAILURE_MATCHES = 'FAILURE_MATCHES'
const failureMatches = (error) => ({
  type: FAILURE_MATCHES,
  error
})

export const matchesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_MATCHES:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_MATCHES:
      return {
        ...state,
        isFetching: false,
        error: undefined,
        matches: action.matches
      }
    case FAILURE_MATCHES:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        matches: undefined
      }
    default:
      return state
  }
}

export const matches = () => (dispatch) => {
  dispatch(requestMatches())

  return axios.get('/api/matches')
    .then(
      ({ data: { matches } }) => {
        dispatch(successMatches(matches))
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error
          dispatch(failureMatches(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}