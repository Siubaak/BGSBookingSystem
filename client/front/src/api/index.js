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
  userGet (oUserId) {
    return axios.post('/api/user', oUserId)
  },
  userListGet () {
    return axios.get('/api/user/list')
  },
  userUpdateInfo (oUser) {
    return axios.post('/api/user/update/info', oUser)
  },
  userUpdatePassword (oUser) {
    return axios.post('/api/user/update/password', oUser)
  },
  notificationGet () {
    return axios.get('/api/notification')
  },
  materialListGet () {
    return axios.get('/api/material/list')
  },
  materialBookCreate (oMaterialBook) {
    return axios.post('/api/material/book/create', oMaterialBook)
  },
  materialBookListGet (oUserId) {
    return axios.post('/api/material/book/list', oUserId)
  },
  meetingBookCreate (oMeetingBook) {
    return axios.post('/api/meeting/book/create', oMeetingBook)
  },
  meetingBookListGet (oUserId) {
    return axios.post('/api/meeting/book/list', oUserId)
  },
  meetingOccupiedTimeGet () {
    return axios.get('/api/meeting/book')
  }
}
