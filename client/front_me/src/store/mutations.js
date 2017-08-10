const USER_LOGIN = 'USER_LOGIN'
const USER_LOGOUT = 'USER_LOGOUT'
export default {
  [USER_LOGIN] (state, token) {
    localStorage.setItem('jwtf', token)
    state.token = token
  },
  [USER_LOGOUT] (state) {
    localStorage.removeItem('jwtf')
    state.token = null
  }
}
