/** Changing mode. */
export const MODAL_STICKY = 'MODAL_SITCKY'
export const MODAL_FLOATING = 'MODAL_FLOATING'

export const SET_MODAL_MODE = 'SET_MODAL_MODE'
export const setModalMode = (mode) => ({
  type: SET_MODAL_MODE,
  mode
})

/** Login form. */
export const LOGIN_FORM = 'LOGIN_FORM'

export const OPEN_LOGIN_FORM = 'OPEN_LOGIN_FORM'
export const openLoginForm = () => ({
  type: OPEN_LOGIN_FORM
})

export const TOGGLE_LOGIN_FORM = 'TOGGLE_LOGIN_FORM'
export const toggleLoginForm = () => ({
  type: TOGGLE_LOGIN_FORM
})

/** Register form. */
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

/** Default state. */
const defaultState = {
  openModal: null,
  mode: MODAL_FLOATING
}

/**
 * Redux reducer.
 *
 * @param {?object} state
 * @param {object}  action
 * @return {object}
 */
export const modalsReducer = (state = defaultState, action) => {
  let openModal

  switch (action.type) {
    case SET_MODAL_MODE:
      return {
        ...state,
        mode: action.mode
      }
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
          : LOGIN_FORM
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