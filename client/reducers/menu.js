const defaultState = {
  hidden: true
}

export const HIDE_MENU = 'HIDE_MENU'
export const hideMenu = () => ({
  type: HIDE_MENU
})

export const SHOW_MENU = 'SHOW_MENU'
export const showMenu = () => ({
  type: SHOW_MENU
})

export const TOGGLE_MENU = 'TOGGLE_MENU'
export const toggleMenu = () => ({
  type: TOGGLE_MENU
})

export const menuReducer = (state = defaultState, action) => {
  switch (action.type) {
    case HIDE_MENU:
      return {
        ...state,
        hidden: true
      }
    case SHOW_MENU:
      return {
        ...state,
        hidden: false
      }
    case TOGGLE_MENU:
      return {
        ...state,
        hidden: !state.hidden
      }
    default:
      return state
  }
}