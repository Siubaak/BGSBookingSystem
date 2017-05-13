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
    return axios.post('/api/admin/material/update', oMaterialId)
  },
  materialListGet () {
    return axios.get('/api/admin/material/list')
  },
  materialBookListGet () {
    return axios.get('/api/admin/material/book/list')
  },
  materialBookListGetAll () {
    return axios.get('/api/admin/material/book/list/all')
  }
}
