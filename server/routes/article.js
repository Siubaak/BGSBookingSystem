var express = require('express'),
    path = require('path'),
    router = express.Router(),
    api = require('../api'),
    tokenCheck = require('../token-mw/token-check')

// 前端API处理路由，不带权限
router.post('/article/list', (req, res) => {
  console.log('POST /api/article/list')
  // console.log(req.body)
  var { page, number } = req.body
  api.getArticleList(page, number)
     .then((articleList) => {
       res.send({ articleList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/article/commentlist', (req, res) => {
  console.log('POST /api/article/commentlist')
  var { articleId } = req.body
  api.getCommentListByArticle(articleId)
     .then((commentList) => {
       res.send({ commentList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

// 后台API处理路由，带权限
router.post('/token/article/create', tokenCheck, (req, res) => {
  console.log('POST /api/token/article/create')
  var article = req.body
  api.createArticle(article)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/article/remove', tokenCheck, (req, res) => {
  console.log('POST /api/token/article/remove')
  var { articleId } = req.body
  api.removeArticle(articleId)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/article/update', tokenCheck, (req, res) => {
  console.log('POST /api/token/article/update')
  var article = req.body
  api.updateArticle(article)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/article', tokenCheck, (req, res) => {
  console.log('POST /api/token/article')
  // console.log(req.body)
  var { articleId } = req.body
  api.getArticle(articleId)
     .then((article) => {
       res.send({ article })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/article/list', tokenCheck, (req, res) => {
  console.log('POST /api/token/article/list')
  var { page, number } = req.body
  api.getArticleList(page, number)
     .then((articleList) => {
       res.send({ articleList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

module.exports = router