import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
let insertToken = () => {
  if (localStorage.getItem('jwtb')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtb').replace(/(^\\")|(\\"$)/g, '')
  }
}

export default {
// 管理员API
  adminLogin (params) {
    return axios.post('/api/admin/login', params)
  },
  adminUpdate (params) {
    insertToken()
    return axios.post('/api/admin/update/password', params)
  },
// 用户API
  userCreate (params) {
    insertToken()
    return axios.post('/api/admin/user/create', params)
  },
  userAuth (params) {
    insertToken()
    return axios.post('/api/admin/user/update/auth', params)
  },
  userReset (params) {
    insertToken()
    return axios.post('/api/admin/user/update/reset', params)
  },
  userRemove (params) {
    insertToken()
    return axios.post('/api/admin/user/remove', params)
  },
  userListGet () {
    insertToken()
    return axios.get('/api/admin/user/list')
  },
// 通知公告API
  notificationGet () {
    insertToken()
    return axios.get('/api/admin/notification')
  },
  notificationUpdate (params) {
    insertToken()
    return axios.post('/api/admin/notification/update', params)
  },
// 物资API
  materialCreate (params) {
    insertToken()
    return axios.post('/api/admin/material/create', params)
  },
  materialUpdateQuantity (params) {
    insertToken()
    return axios.post('/api/admin/material/update/quantity', params)
  },
  materialRemove (params) {
    insertToken()
    return axios.post('/api/admin/material/remove', params)
  },
  materialListGet () {
    insertToken()
    return axios.get('/api/admin/material/list')
  },
  materialBookUpdateRemark (params) {
    insertToken()
    return axios.post('/api/admin/material/book/update/remark', params)
  },
  materialBookUpdateCondition (params, condition) {
    insertToken()
    switch (condition) {
      case '借出':
        return axios.post('/api/admin/material/book/update/lend', params)
      case '归还':
        return axios.post('/api/admin/material/book/update/return', params)
      default:
        return axios.post('/api/admin/material/book/update/fail', params)
    }
  },
  materialBookRemove (params) {
    insertToken()
    return axios.post('/api/admin/material/book/remove', params)
  },
  materialBookListGet () {
    insertToken()
    return axios.get('/api/admin/material/book/list')
  },
  materialBookListGetAll () {
    insertToken()
    return axios.get('/api/admin/material/book/list/all')
  },
// 会议室API
  meetingBookUpdateFail (params) {
    insertToken()
    return axios.post('/api/admin/meeting/book/update/fail', params)
  },
  meetingBookRemove (params) {
    insertToken()
    return axios.post('/api/admin/meeting/book/remove', params)
  },
  meetingBookListGet () {
    insertToken()
    return axios.get('/api/admin/meeting/book/list')
  },
  meetingBookListGetAll () {
    insertToken()
    return axios.get('/api/admin/meeting/book/list/all')
  }
}
