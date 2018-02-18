const defaultState = {
  open: false
}

export const OPEN_LOGIN_FORM = 'OPEN_LOGIN_FORM'
export const openLoginForm = () => ({
  type: OPEN_LOGIN_FORM
})

export const HIDE_LOGIN_FORM = 'HIDE_LOGIN_FORM'
export const hideLoginForm = () => ({
  type: HIDE_LOGIN_FORM
})

export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM'
export const toggleLoginForm = () => ({
  type: TOGGLE_LOGIN_FORM
})

export const loginFormReducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_LOGIN_FORM:
      return {
        ...state,
        open: true
      }
    case HIDE_LOGIN_FORM:
      return {
        ...state,
        open: false
      }
    case TOGGLE_LOGIN_FORM:
      return {
        ...state,
        open: !state.open
      }
    default:
      return state
  }
}