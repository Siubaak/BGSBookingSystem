import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json'
if (localStorage.getItem('jwt')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt').replace(/(^\\")|(\\"$)/g, '')
}

export default {
// 登录API
  adminLogin (objectAccountPassword) {
    return axios.post('/api/login', objectAccountPassword)
  },
// 文章API
  createArticle (objectArticle) {
    return axios.post('/api/token/article/create', objectArticle)
  },
  removeArticle (objectArticleId) {
    return axios.post('/api/token/article/remove', objectArticleId)
  },
  updateArticle (objectArticle) {
    return axios.post('/api/token/article/update', objectArticle)
  },
  getArticleList (objectPageNumber) {
    return axios.post('/api/token/article/list', objectPageNumber)
  },
// 分类API
  createClassification (objectName) {
    return axios.post('/api/token/classification/create', objectName)
  },
  removeClassification (objectClassificationId) {
    return axios.post('/api/token/classification/remove', objectClassificationId)
  },
  updateClassification (objectClassification) {
    return axios.post('/api/token/classification/update', objectClassification)
  },
  getClassificationList () {
    return axios.get('/api/token/classification/list')
  },
// 评论API
  removeComment (objectCommentId) {
    return axios.post('/api/token/comment/remove', objectCommentId)
  },
  getCommentList (objectPageNumber) {
    return axios.post('/api/token/comment/list', objectPageNumber)
  }
}
