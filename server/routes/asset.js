let express = require('express')
let path = require('path')
let router = express.Router()

// 前端页面返回路由
router.get('/', (req, res) => {
  res.sendFile(path.resolve('./assets/front/dist/index.html'))
})

// 后台页面返回路由
router.get('/admin', (req, res) => {
  res.sendFile(path.resolve('./assets/back/dist/index.html'))
})

module.exports = router