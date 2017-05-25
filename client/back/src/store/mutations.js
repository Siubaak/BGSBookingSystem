const ADMIN_LOGIN = 'ADMIN_LOGIN'
const ADMIN_LOGOUT = 'ADMIN_LOGOUT'
export default {
  [ADMIN_LOGIN] (state, token) {
    localStorage.setItem('jwtb', token)
    state.token = token
  },
  [ADMIN_LOGOUT] (state) {
    localStorage.removeItem('jwtb')
    state.token = null
  }
}
