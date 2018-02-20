const defaultState = {
  running: false,
  open: true
}

export const SET_FILTER_MATCHES = 'SET_FILTER_MATCHES'
export const setFilterMatches = (filter) => ({
  type: SET_FILTER_MATCHES,
  filter
})

export const filterMatchesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_FILTER_MATCHES:
      return {
        ...state,
        ...action.filter
      }
    default:
      return state
  }
}