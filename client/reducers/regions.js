import axios from 'axios'
import { REQUEST_LOGIN } from './login';

const defaultState = {
  isFetching: false,
  error: undefined,
  regions: undefined
}

export const REQUEST_REGIONS = 'REQUEST_REGIONS'
const requestRegions = () => ({
  type: REQUEST_REGIONS
})

export const SUCCESS_REGIONS = 'SUCCESS_REGIONS'
const successRegions = (regions) => ({
  type: SUCCESS_REGIONS,
  regions
})

export const FAILURE_REGIONS = 'FAILURE_REGIONS'
const failureRegions = (error) => ({
  type: FAILURE_REGIONS,
  error
})

export const regionsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_REGIONS:
      return {
        ...state,
        isFetching: true
      }
    case SUCCESS_REGIONS:
      return {
        ...state,
        isFetching: false,
        error: undefined,
        regions: action.regions
      }
    case FAILURE_REGIONS:
      return {
        ...state,
        isFetching: false,
        error: action.error,
        regions: undefined
      }
    default:
      return state
  }
}

export const regions = (token) => (dispatch) => {
  dispatch(requestRegions())

  return axios.get('/api/regions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(
      ({ data: { regions } }) => {
        dispatch(successRegions(regions))
      },
      (error) => {
        if (error.response) {
          const message = error.response.data.error
          dispatch(failureRegions(message))

          throw new Error(message)
        }

        throw new Error('No response')
      }
    )
}