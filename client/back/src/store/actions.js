import api from '../api'
import router from '../router'
export default {
  adminLogin ({ commit }, oAccountPassword) {
    api.adminLogin(oAccountPassword)
      .then((res) => {
        if (res.data.token) {
          commit('ADMIN_LOGIN', res.data.token)
          router.replace({ path: '/admin' })
        } else {
          alert(res.data.msg || res.data.err)
        }
      })
  },
  adminLogout ({ commit }) {
    commit('ADMIN_LOGOUT')
    router.push({ path: '/login' })
  }
}
