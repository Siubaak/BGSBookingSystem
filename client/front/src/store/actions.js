import api from '../api'
import router from '../router'
import weui from 'weui.js'
export default {
  login ({ commit }, objectDepartmentPassword) {
    api.login(objectDepartmentPassword)
      .then((res) => {
        if (res.data.token) {
          weui.toast('登录成功', 2000)
          commit('USER_LOGIN', res.data.token)
          router.replace({ path: '/' })
        } else {
          weui.toast(`登录失败（${res.data.msg || res.data.err}）`, 2000)
        }
      })
  },
  logout ({ commit }) {
    commit('USER_LOGOUT')
    router.push({ path: '/' })
    weui.toast('注销成功', 2000)
  }
}
