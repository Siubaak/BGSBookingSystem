let express = require('express')
let path = require('path')
let router = express.Router()
let api = require('../api')
let tokenCreate = require('../token-mw/token-create')
let tokenCheck = require('../token-mw/token-check')
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

// 后台更新管理员密码
router.post('/admin/update/password', tokenCheck, (req, res) => {
  let admin = req.body
  admin.password = sha1(admin.password)
  admin.oldPassword = sha1(admin.oldPassword)
  api.updateAdmin(admin)
    .then((result) => {
      console.log(result)
      if (result.result.n) {
        res.send({ msg: '修改密码成功' })
      } else {
        res.send({ msg: '原密码输入错误' })
      }
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台创建部门用户
router.post('/admin/user/create', tokenCheck, (req, res) => {
  let { department } = req.body
  let user = {
    department: department,
    password: sha1(123456),
    isAuth: false,
    reName: '',
    rePhone: '',
    materialBook: 0,
    meetingBook: 0
  }
  api.createUser(user)
    .then((result) => {
      res.send({ msg: '创建用户成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台更新部门用户授权
router.post('/admin/user/update/auth', tokenCheck, (req, res) => {
  let user = req.body
  user.isAuth = !user.isAuth
  api.updateUser(user)
    .then((result) => {
      res.send({ msg: '更新授权成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台重置部门用户
router.post('/admin/user/update/reset', tokenCheck, (req, res) => {
  let user = req.body
  user.password = sha1(123456)
  user.isAuth = false
  user.reName = ''
  user.rePhone = ''
  api.updateUser(user)
    .then((result) => {
      res.send({ msg: '重置用户成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台移除部门用户
router.post('/admin/user/remove', tokenCheck, (req, res) => {
  let { userId } = req.body
  api.removeUser(userId)
    .then((result) => {
      res.send({ msg: '删除用户成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台获取所有部门用户列表
router.get('/admin/user/list', tokenCheck, (req, res) => {
  api.getUserList()
    .then((userList) => {
      res.send({ userList })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台获取通知公告
router.get('/admin/notification', tokenCheck, (req, res) => {
  api.getNotification()
    .then((notification) => {
      res.send({ notification })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台编辑通知公告
router.post('/admin/notification/update', tokenCheck, (req, res) => {
  let notification = req.body
  api.updateNotification(notification)
    .then((result) => {
      res.send({ msg: '更新通知公告成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台创建物资
router.post('/admin/material/create', tokenCheck, (req, res) => {
  let material = req.body
  api.createMaterial(material)
    .then((result) => {
      res.send({ msg: '创建物资成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台更新物资
router.post('/admin/material/update', tokenCheck, (req, res) => {
  let material = req.body
  api.updateMaterial(material)
    .then((result) => {
      res.send({ msg: '更新物资成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台移除物资
router.post('/admin/material/remove', tokenCheck, (req, res) => {
  let { materialId } = req.body
  api.removeMaterial(materialId)
    .then((result) => {
      res.send({ msg: '删除物资成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台获取物资列表
router.get('/admin/material/list', tokenCheck, (req, res) => {
  api.getMaterialList(false)
    .then((materialList) => {
      res.send({ materialList })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台获取所有未处理物资申请列表
router.get('/admin/material/book/list', tokenCheck, (req, res) => {
  api.getMaterialBookList('back')
    .then((materialBookList) => {
      res.send({ materialBookList })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 后台获取所有物资申请列表
router.get('/admin/material/book/list/all', tokenCheck, (req, res) => {
  api.getMaterialBookList()
    .then((materialBookList) => {
      res.send({ materialBookList })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

module.exports = router