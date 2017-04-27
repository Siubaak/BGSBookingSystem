var express = require('express'),
    path = require('path'),
    router = express.Router(),
    api = require('../api'),
    tokenCheck = require('../token-mw/token-check')

// 前端API处理路由，不带权限
router.get('/classification/list', (req, res) => {
  console.log('GET /api/classification/list')
  api.getClassificationList()
     .then((classList) => {
       res.send({ classList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/classification/articlelist', (req, res) => {
  console.log('POST /api/classification/articlelist')
  // console.log(req.body)
  var { name, page, number } = req.body
  api.getArticleListByClassification(name, page, number)
     .then((articleList) => {
       res.send({ articleList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

// 后台API处理路由，带权限
router.post('/token/classification/create', tokenCheck, (req, res) => {
  console.log('POST /api/classification/create')
  var { name } = req.body
  console.log(name)
  api.createClassification(name)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/classification/remove', tokenCheck, (req, res) => {
  console.log('POST /api/classification/remove')
  var { classificationId } = req.body
  api.removeClassification(classificationId)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.post('/token/classification/update', tokenCheck, (req, res) => {
  console.log('POST /api/classification/update')
  var { classification } = req.body
  api.updateClassification(classification)
     .then((result) => {
       res.send({ result })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})
router.get('/token/classification/list', tokenCheck, (req, res) => {
  console.log('GET /api/token/classification/list')
  api.getClassificationList()
     .then((classList) => {
       res.send({ classList })
       console.log('-- Successful Response')
     }).catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

module.exports = router