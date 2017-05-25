import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
let insertToken = () => {
  if (localStorage.getItem('jwtb')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtb').replace(/(^\\")|(\\"$)/g, '')
  }
}

export default {
// 管理员API
  adminLogin (oAccountPassword) {
    return axios.post('/api/admin/login', oAccountPassword)
  },
  adminUpdate (oPassword) {
    insertToken()
    return axios.post('/api/admin/update/password', oPassword)
  },
// 用户API
  userCreate (oDepartment) {
    insertToken()
    return axios.post('/api/admin/user/create', oDepartment)
  },
  userAuth (oUser) {
    insertToken()
    return axios.post('/api/admin/user/update/auth', oUser)
  },
  userReset (oUser) {
    insertToken()
    return axios.post('/api/admin/user/update/reset', oUser)
  },
  userRemove (oUserId) {
    insertToken()
    return axios.post('/api/admin/user/remove', oUserId)
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
  notificationUpdate (oNotification) {
    insertToken()
    return axios.post('/api/admin/notification/update', oNotification)
  },
// 物资API
  materialCreate (oMaterial) {
    insertToken()
    return axios.post('/api/admin/material/create', oMaterial)
  },
  materialUpdateQuantity (params) {
    insertToken()
    return axios.post('/api/admin/material/update/quantity', params)
  },
  materialRemove (oMaterialId) {
    insertToken()
    return axios.post('/api/admin/material/remove', oMaterialId)
  },
  materialListGet () {
    insertToken()
    return axios.get('/api/admin/material/list')
  },
  materialBookUpdateRemark (params) {
    insertToken()
    return axios.post('/api/admin/material/book/update/remark', params)
  },
  materialBookUpdateCondition (oMaterialBookId, condition) {
    insertToken()
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
    insertToken()
    return axios.post('/api/admin/material/book/remove', oMaterialBookId)
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
  meetingBookUpdateFail (oMeetingBookId) {
    insertToken()
    return axios.post('/api/admin/meeting/book/update/fail', oMeetingBookId)
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
