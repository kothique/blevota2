import { loginReducer } from './login'
import { registerReducer } from './register'
import { matchesReducer } from './matches'
import { newMatchReducer } from './new-match'
import { menuReducer } from './menu'

export default {
  login: loginReducer,
  register: registerReducer,
  matches: matchesReducer,
  newMatch: newMatchReducer,
  menu: menuReducer
}