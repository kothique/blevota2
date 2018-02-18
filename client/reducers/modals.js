const defaultState = {
  openModal: null
}

export const LOGIN_FORM = 'LOGIN_FORM'

export const OPEN_LOGIN_FORM = 'OPEN_LOGIN_FORM'
export const openLoginForm = () => ({
  type: OPEN_LOGIN_FORM
})

export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM'
export const toggleLoginForm = () => ({
  type: TOGGLE_LOGIN_FORM
})

export const REGISTER_FORM = 'REGISTER_FORM'

export const OPEN_REGISTER_FORM = 'OPEN_REGISTER_FORM'
export const openRegisterForm = () => ({
  type: OPEN_REGISTER_FORM
})

export const TOGGLE_REGISTER_FORM = 'TOGGLE_REGISTER_FORM'
export const toggleRegisterForm = () => ({
  type: TOGGLE_REGISTER_FORM
})

export const HIDE_MODALS = 'HIDE_MODALS'
export const hideModals = () => ({
  type: HIDE_MODALS
})

export const modalsReducer = (state = defaultState, action) => {
  let openModal

  switch (action.type) {
    case OPEN_LOGIN_FORM:
      return {
        ...state,
        openModal: LOGIN_FORM
      }
    case TOGGLE_LOGIN_FORM:
      return {
        ...state,
        openModal: state.openModal === LOGIN_FORM
          ? null
          : REGISTER_FORM
      }
    case OPEN_REGISTER_FORM:
      return {
        ...state,
        openModal: REGISTER_FORM
      }
    case TOGGLE_REGISTER_FORM:
      return {
        ...state,
        openModal: state.openModal === REGISTER_FORM
          ? null
          : REGISTER_FORM
      }
    case HIDE_MODALS:
      return {
        ...state,
        openModal: null
      }
    default:
      return state
  }
}