const ADMIN_LOGIN = 'ADMIN_LOGIN'
const ADMIN_LOGOUT = 'ADMIN_LOGOUT'
export default {
  [ADMIN_LOGIN] (state, token) {
    localStorage.setItem('jwt', token)
    state.token = token
  },
  [ADMIN_LOGOUT] (state) {
    localStorage.removeItem('jwt')
    state.token = null
  }
}
