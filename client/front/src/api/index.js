import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
if (localStorage.getItem('jwt')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt').replace(/(^\\")|(\\"$)/g, '')
}

export default {
// 登录API
  login (oDepartmentnPassword) {
    return axios.post('/api/login', oDepartmentnPassword)
  },
  userGet (oUserId) {
    return axios.post('/api/user', oUserId)
  },
  userListGet () {
    return axios.get('/api/user/list')
  },
  userUpdateInfo (oUserIdnReNamenRePhonenPasswordForCheck) {
    return axios.post('/api/user/update/info', oUserIdnReNamenRePhonenPasswordForCheck)
  },
  userUpdatePassword (oUserIdnNewPasswordnPasswordForCheck) {
    return axios.post('/api/user/update/password', oUserIdnNewPasswordnPasswordForCheck)
  },
  notificationGet () {
    return axios.get('/api/notification')
  },
  materialListGet () {
    return axios.get('/api/material/list')
  },
  materialBookCreate (oMaterialBooknMaterialBookItems) {
    return axios.post('/api/material/book/create', oMaterialBooknMaterialBookItems)
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
