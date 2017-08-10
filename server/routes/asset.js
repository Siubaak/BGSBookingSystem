let express = require('express')
let path = require('path')
let router = express.Router()

// 前端物资申请页面返回路由
router.get('/ma', (req, res) => {
  res.sendFile(path.resolve('./assets/front_ma/dist/index.html'))
})

// 前端会议室页面返回路由
router.get('/me', (req, res) => {
  res.sendFile(path.resolve('./assets/front_me/dist/index.html'))
})

// 后台页面返回路由
router.get('/admin', (req, res) => {
  res.sendFile(path.resolve('./assets/back/dist/index.html'))
})

module.exports = router