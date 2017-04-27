var express = require('express'),
    path = require('path'),
    router = express.Router(),
    api = require('../api'),
    tokenCreate = require('../token-mw/token-create'),
    sha1 = require('sha1'),
    dotenv = require('dotenv')

dotenv.load()

// 后台登录路由，返回token
router.post('/login', (req, res) => {
  console.log('POST /api/login')
  var { account, password } = req.body
  api.getAdmin(account)
     .then((admin) => {
       if (admin && (sha1(password) === admin.password)) {
         res.send({ token: tokenCreate(account) })
       } else {
         res.send({ msg: '用户名或密码错误' })
       }
       console.log('-- Successful Response')
     })
     .catch((err) => {
       res.send({ err })
       console.log('-- Error Response')
     })
})

module.exports = router