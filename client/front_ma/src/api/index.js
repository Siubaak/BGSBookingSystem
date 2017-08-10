import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
let insertToken = () => {
  if (localStorage.getItem('jwtf')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtf').replace(/(^\\")|(\\"$)/g, '')
  }
}

export default {
// 登录API
  login (params) {
    return axios.post('/api/login', params)
  },
  userInfoGet (params) {
    return axios.post('/api/user/info', params)
  },
  userListGet () {
    return axios.get('/api/user/list')
  },
  userUpdateInfo (params) {
    insertToken()
    return axios.post('/api/user/update/info', params)
  },
  userUpdatePassword (params) {
    insertToken()
    return axios.post('/api/user/update/password', params)
  },
  notificationGet () {
    return axios.get('/api/notification')
  },
  materialListGet () {
    insertToken()
    return axios.get('/api/material/list')
  },
  materialBookCreate (params) {
    insertToken()
    return axios.post('/api/material/book/create', params)
  },
  materialBookUpdateFail (params) {
    insertToken()
    return axios.post('/api/material/book/update/fail', params)
  },
  materialBookListGet (params) {
    insertToken()
    return axios.post('/api/material/book/list', params)
  },
  meetingBookCreate (params) {
    insertToken()
    return axios.post('/api/meeting/book/create', params)
  },
  meetingBookUpdateFail (params) {
    insertToken()
    return axios.post('/api/meeting/book/update/fail', params)
  },
  meetingBookListGet (params) {
    insertToken()
    return axios.post('/api/meeting/book/list', params)
  },
  meetingOccupiedTimeGet () {
    insertToken()
    return axios.get('/api/meeting/book')
  }
}
