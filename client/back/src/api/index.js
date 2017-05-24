import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
if (localStorage.getItem('jwt')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt').replace(/(^\\")|(\\"$)/g, '')
}

export default {
// 管理员API
  adminLogin (oAccountPassword) {
    return axios.post('/api/admin/login', oAccountPassword)
  },
  adminUpdate (oPassword) {
    return axios.post('/api/admin/update/password', oPassword)
  },
// 用户API
  userCreate (oDepartment) {
    return axios.post('/api/admin/user/create', oDepartment)
  },
  userAuth (oUser) {
    return axios.post('/api/admin/user/update/auth', oUser)
  },
  userReset (oUser) {
    return axios.post('/api/admin/user/update/reset', oUser)
  },
  userRemove (oUserId) {
    return axios.post('/api/admin/user/remove', oUserId)
  },
  userListGet () {
    return axios.get('/api/admin/user/list')
  },
// 通知公告API
  notificationGet () {
    return axios.get('/api/admin/notification')
  },
  notificationUpdate (oNotification) {
    return axios.post('/api/admin/notification/update', oNotification)
  },
// 物资API
  materialCreate (oMaterial) {
    return axios.post('/api/admin/material/create', oMaterial)
  },
  materialUpdate (oMaterial) {
    return axios.post('/api/admin/material/update', oMaterial)
  },
  materialRemove (oMaterialId) {
    return axios.post('/api/admin/material/remove', oMaterialId)
  },
  materialListGet () {
    return axios.get('/api/admin/material/list')
  },
  materialBookUpdate (oMaterialBookId, condition) {
    switch (condition) {
      case 'lend':
        return axios.post('/api/admin/material/book/update/lend', oMaterialBookId)
      case 'return':
        return axios.post('/api/admin/material/book/update/return', oMaterialBookId)
      default:
        return axios.post('/api/admin/material/book/update/fail', oMaterialBookId)
    }
  },
  materialBookRemove (oMaterialBookId) {
    return axios.post('/api/admin/material/book/remove', oMaterialBookId)
  },
  materialBookListGet () {
    return axios.get('/api/admin/material/book/list')
  },
  materialBookListGetAll () {
    return axios.get('/api/admin/material/book/list/all')
  },
// 会议室API
  meetingBookUpdateFail (oMeetingBookId) {
    return axios.post('/api/admin/meeting/book/update/fail', oMeetingBookId)
  },
  meetingBookRemove (params) {
    return axios.post('/api/admin/meeting/book/remove', params)
  },
  meetingBookListGet () {
    return axios.get('/api/admin/meeting/book/list')
  },
  meetingBookListGetAll () {
    return axios.get('/api/admin/meeting/book/list/all')
  }
}
