let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create')
let tokenCheck = require('../token-mw/token-check')
let sha1 = require('sha1')
let dotenv = require('dotenv')

dotenv.load()

// 前台登录，返回token
router.post('/login', (req, res) => {
  let { department, password } = req.body
  api.getUser(department)
     .then((user) => {
       if (user && (sha1(password) === user.password)) {
         res.send({ token: tokenCreate(department) })
       } else {
         res.send({ msg: '密码错误' })
       }
       console.log(`-- Successful Response (${req.originalUrl}) !`)
     })
     .catch((err) => {
       res.send({ err })
       console.log(`-- Error Response (${req.originalUrl}) !`)
     })
})

// 前台更新用户信息
router.post('/user/update', tokenCheck, (req, res) => {
  let user = req.body
  api.updateUser()
})

module.exports = router