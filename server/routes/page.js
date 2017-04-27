var express = require('express'),
    path = require('path'),
    router = express.Router()

// 前端页面返回路由
router.get('/', (req, res) => {
  console.log('GET /')
  res.sendfile('page/front/dist/index.html')
  console.log('-- Successful Response')
})

// 后台页面返回路由
router.get('/admin', (req, res) => {
  console.log('GET /admin')
  res.sendfile('page/back/dist/index.html')
  console.log('-- Successful Response')
})

module.exports = router