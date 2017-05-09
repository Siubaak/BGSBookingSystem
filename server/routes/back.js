let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create')
let sha1 = require('sha1')
let dotenv = require('dotenv')

dotenv.load()

// 后台登录路由，返回token
router.post('/admin/login', (req, res) => {
  let { account, password } = req.body
  api.getAdmin(account)
     .then((admin) => {
       if (admin && (sha1(password) === admin.password)) {
         res.send({ token: tokenCreate(account) })
       } else {
         res.send({ msg: '用户名或密码错误' })
       }
       console.log(`-- Successful Response (${req.originalUrl}) !`)
     })
     .catch((err) => {
       res.send({ err })
       console.log(`-- Error Response (${req.originalUrl}) !`)
     })
})

module.exports = router