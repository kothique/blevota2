import { loginReducer } from './login'
import { registerReducer } from './register'
import { matchesReducer } from './matches'
import { filterMatchesReducer } from './filter-matches'
import { modalsReducer } from './modals'
import { newMatchReducer } from './new-match'
import { mobileMenuReducer } from './mobile-menu'

export default {
  login: loginReducer,
  register: registerReducer,
  matches: matchesReducer,
  filterMatches: filterMatchesReducer,
  modals: modalsReducer,
  newMatch: newMatchReducer,
  mobileMenu: mobileMenuReducer
}