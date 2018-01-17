import axios from 'axios'

const defaultState = {
  isFetching: false,
  user: undefined
}

export const REQUEST_USER = 'REQUEST_USER'
const requestUser = () => ({
  type: REQUEST_USER
})

export const RECEIVE_USER = 'RECEIVE_USER'
const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user
})

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_USER:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_USER:
      return {
        ...state,
        isFetching: false,
        user: action.user
      }
    default:
      return state
  }
}

export const fetchUser = () => (dispatch) => {
  dispatch(requestUser())

  return axios('/api/user')
    .then(
      json => dispatch(receiveUser(json)),
      error => console.log(error)
    )
}
