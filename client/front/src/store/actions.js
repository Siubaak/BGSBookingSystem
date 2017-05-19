import api from '../api'
import router from '../router'
import weui from 'weui.js'
export default {
  login ({ commit }, objectDepartmentPassword) {
    api.login(objectDepartmentPassword)
      .then((res) => {
        if (res.data.token) {
          weui.toast('登录成功', 1000)
          commit('USER_LOGIN', res.data.token)
          router.replace({ path: '/' })
        } else {
          weui.alert(`${res.data.msg || res.data.err}`)
        }
      })
  },
  logout ({ commit }) {
    commit('USER_LOGOUT')
    router.push({ path: '/log' })
    weui.toast('注销成功', 1000)
  }
}
