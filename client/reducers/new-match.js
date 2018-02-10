import axios from 'axios'

import { matches } from './matches'

const defaultState = {
  isFetching: false,
  id: undefined,
  error: undefined
}

export const REQUEST_NEW_MATCH = 'REQUEST_NEW_MATCH'
const requestNewMatch = () => ({
  type: REQUEST_NEW_MATCH
})

export const SUCCESS_NEW_MATCH = 'SUCCESS_NEW_MATCH'
const successNewMatch = (id) => ({
  type: SUCCESS_NEW_MATCH,
  id
})

export const FAILURE_NEW_MATCH = 'FAILURE_NEW_MATCH'
const failureNewMatch = (error) => ({
  type: FAILURE_NEW_MATCH,
  error
})

export const newMatchReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_NEW_MATCH:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_NEW_MATCH:
      return {
        ...state,
        isFetching: false,
        id: action.id,
        error: undefined
      }
    case FAILURE_NEW_MATCH:
      return {
        ...state,
        isFetching: false,
        id: undefined,
        error: action.error
      }
    default:
      return state
  }
}

export const newMatch = () => (dispatch) => {
  dispatch(requestNewMatch())

  return axios.put('/api/match')
    .then(
      ({ data: { id } }) => {
        dispatch(successNewMatch(id))
        dispatch(matches())
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error
          dispatch(failureNewMatch(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}