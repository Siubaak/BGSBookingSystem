import api from '../api'
import router from '../router'
export default {
  adminLogin ({ commit }, objectAccountPassword) {
    api.adminLogin(objectAccountPassword)
      .then((res) => {
        if (res.data.token) {
          commit('ADMIN_LOGIN', res.data.token)
          router.replace({ path: '/admin' })
          console.log('-- Successful Login')
        } else {
          alert(res.data.msg || res.data.err)
          console.log('-- Error Login')
        }
      })
      .catch((err) => {
        console.log(err)
        console.log('-- Error Login')
      })
  },
  adminLogout ({ commit }) {
    console.log('Logouting...')
    commit('ADMIN_LOGOUT')
    router.push({ path: '/login' })
    console.log('-- Successful Logout')
  }
}
