import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
if (localStorage.getItem('jwt')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt').replace(/(^\\")|(\\"$)/g, '')
}

export default {
// 登录API
  login (oDepartmentPassword) {
    return axios.post('/api/login', oDepartmentPassword)
  },
  updateUser (oUser) {
    return axios.post('/api/user/update', oUser)
  },
  getMaterialList () {
    return axios.get('/api/material/list')
  },
  createMaterialBook (oMaterialBook) {
    return axios.post('/api/material/book/create', oMaterialBook)
  },
  getMaterialBookList (oUserId) {
    return axios.post('/api/material/book/list', oUserId)
  },
  createMeetingBook (oMeetingBook) {
    return axios.post('/api/meeting/book/create', oMeetingBook)
  },
  getMeetingBookList (oUserId) {
    return axios.post('/api/meeting/book/list', oUserId)
  }
}
