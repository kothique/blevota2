import { loginReducer } from './login'
import { registerReducer } from './register'
import { regionsReducer } from './regions'
import { modalsReducer } from './modals'
import { mobileMenuReducer } from './mobile-menu'

export default {
  login: loginReducer,
  register: registerReducer,
  regions: regionsReducer,
  modals: modalsReducer,
  mobileMenu: mobileMenuReducer
}