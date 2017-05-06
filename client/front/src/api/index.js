import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
if (localStorage.getItem('jwt')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt').replace(/(^\\")|(\\"$)/g, '')
}

export default {
// 登录API
  adminLogin (objectAccountPassword) {
    return axios.post('/api/login', objectAccountPassword)
  }
}
