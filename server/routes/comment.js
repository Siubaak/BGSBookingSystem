var express = require('express'),
    path = require('path'),
    router = express.Router(),
    api = require('../api'),
    tokenCheck = require('../token-mw/token-check')

// 前端API处理路由，不带权限
router.post('/comment/create', (req, res) => {
  console.log('POST /api/comment/create')
  var comment = req.body
  api.createComment(comment)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

// 后台API处理路由，带权限
router.post('/token/comment/remove', tokenCheck, (req, res) => {
  console.log('POST /api/token/comment/remove')
  var { commentId } = req.body
  api.removeComment(commentId)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/comment/list', tokenCheck, (req, res) => {
  console.log('POST /api/token/comment/list')
  var { page, number } = req.body
  api.getCommentList(page, number)
     .then((commentList) => {
       res.send({ commentList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

module.exports = router