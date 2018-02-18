import { loginReducer } from './login'
import { registerReducer } from './register'
import { matchesReducer } from './matches'
import { modalsReducer } from './modals'
import { newMatchReducer } from './new-match'
import { menuReducer } from './menu'

export default {
  login: loginReducer,
  register: registerReducer,
  matches: matchesReducer,
  modals: modalsReducer,
  newMatch: newMatchReducer,
  menu: menuReducer
}