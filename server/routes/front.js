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
  api.updateUser(user)
    .then((result) => {
      res.send({ msg: '更新成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 前台获取物资列表
router.get('/material/list', tokenCheck, (req, res) => {
  api.getMaterialList()
    .then((data) => {
      res.send({ data })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 前台创建物资申请表单
router.post('/material/book/create', tokenCheck, (req, res) => {
  let materialBook = req.body
  api.createMaterialBook(materialBook)
    .then((result) => {
      res.send({ msg: '创建成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 前台获取用户所有物资申请表单
router.post('/material/book/list', tokenCheck, (req, res) => {
  let { userId } = req.body
  api.getMaterialBookList(userId)
    .then((data) => {
      res.send({ data })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 前台创建会议室预约表单
router.post('/meeting/book/create', tokenCheck, (req, res) => {
  let meetingBook = req.body
  api.createMeetingBook(meetingBook)
    .then((result) => {
      res.send({ msg: '创建成功' })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

// 前台获取用户所有会议室预约表单
router.post('/meeting/book/list', tokenCheck, (req, res) => {
  let { userId } = req.body
  api.getMeetingBookList(userId)
    .then((data) => {
      res.send({ data })
      console.log(`-- Successful Response (${req.originalUrl}) !`)
    })
    .catch((err) => {
      res.send({ err })
      console.log(`-- Error Response (${req.originalUrl}) !`)
    })
})

module.exports = router