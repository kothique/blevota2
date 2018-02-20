const defaultState = {
  hidden: true
}

export const HIDE_MOBILE_MENU = 'HIDE_MOBILE_MENU'
export const hideMobileMenu = () => ({
  type: HIDE_MOBILE_MENU
})

export const SHOW_MOBILE_MENU = 'SHOW_MOBILE_MENU'
export const showMobileMenu = () => ({
  type: SHOW_MOBILE_MENU
})

export const TOGGLE_MOBILE_MENU = 'TOGGLE_MOBILE_MENU'
export const toggleMobileMenu = () => ({
  type: TOGGLE_MOBILE_MENU
})

export const mobileMenuReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HIDE_MOBILE_MENU:
      return {
        ...state,
        hidden: true
      }
    case SHOW_MOBILE_MENU:
      return {
        ...state,
        hidden: false
      }
    case TOGGLE_MOBILE_MENU:
      return {
        ...state,
        hidden: !state.hidden
      }
    default:
      return state
  }
}