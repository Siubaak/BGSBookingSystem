import api from '../api'
import router from '../router'
import weui from 'weui.js'
export default {
  login ({ commit }, objectDepartmentPassword) {
    let loading = weui.loading('登录中')
    api.login(objectDepartmentPassword)
      .then((res) => {
        loading.hide()
        if (res.status === 200) {
          weui.toast('登录成功', 1500)
          commit('USER_LOGIN', res.data.token)
          router.replace({ path: '/' })
        } else {
          weui.alert(res.data.msg)
        }
      })
      .catch((err) => {
        loading.hide()
        console.error(err)
        weui.alert('登录请求出错，请稍后再试')
      })
  },
  logout ({ commit }) {
    commit('USER_LOGOUT')
    router.push({ path: '/log' })
    weui.toast('注销成功', 1500)
  }
}
