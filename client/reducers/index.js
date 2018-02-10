import { loginReducer } from './login'
import { registerReducer } from './register'
import { matchesReducer } from './matches'
import { newMatchReducer } from './new-match'

export default {
  login: loginReducer,
  register: registerReducer,
  matches: matchesReducer,
  newMatch: newMatchReducer
}