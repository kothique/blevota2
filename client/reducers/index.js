import { loginReducer } from './login'
import { userReducer } from './user'
import { logoutReducer } from './logout'
import { registerReducer } from './register'

export default {
  login: loginReducer,
  register: registerReducer,
  logout: logoutReducer,
  user: userReducer
}